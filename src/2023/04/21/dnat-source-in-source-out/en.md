---
title: "DNAT Preserving Client IP with Symmetric Routing"
date: 2023-04-21 21:30:00 +0000
---

Recently I got a symmetric broadband connection, so I wanted to move some services back home... After all, for things like trusted computing, it's still better to run them on your own hardware.

If you only do simple port forwarding, the server at home cannot see the client's real address, so I wanted to do something about that. This situation shouldn't be that uncommon, and I had tinkered with iptables before. In fact, I had written the server-side DNAT rules a long time ago, but for the life of me I just couldn't get it working.

```bash
#!/bin/sh

sysctl -w net.ipv4.ip_forward=1
iptables -P FORWARD DROP
iptables -F FORWARD
iptables -t nat -F

wg-quick down wg_px
wg-quick up wg_px

pub_addr=1.2.3.4
prv_addr=192.168.101.2
pub_if=eth0
prv_if=wg_px
proto=tcp


port_map() {
  bind_port=$1
  prv_port=$2

  iptables -t nat -A PREROUTING -p $proto -d $pub_addr --dport $bind_port -j DNAT --to $prv_addr:$prv_port
  iptables -I FORWARD -p $proto -i $pub_if -o $prv_if -d $prv_addr --dport $prv_port -j ACCEPT
  iptables -t nat -A POSTROUTING -p $proto -s $prv_addr --sport $prv_port -j SNAT --to $pub_addr:$bind_port
}

iptables -I FORWARD -m state --state NEW,RELATED,ESTABLISHED -j ACCEPT
iptables -I FORWARD -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu

port_map 443 40443
port_map 80  40080

```

After writing the above, I discovered something very strange: for some reason, the return packets were being sent back onto WireGuard again. I couldn't figure it out, and I couldn't find any answer online either... In the end I thought, could this be a bug? Then I switched to another machine and found that it worked fine there... Cost me two hours...

Below is the script I used to ensure local packets are routed correctly:

```bash
#!/bin/sh

docker_if=br-web-services

ensure_chain() {
  name=$1
  sys_chain=$2
  new_chain=$1_$2
  (iptables -t mangle -L | grep -qF -- "Chain $new_chain") || \
    (iptables -t mangle -N $new_chain && iptables -t mangle -I $sys_chain -j $new_chain)
  iptables -t mangle -F $new_chain
}

ensure_chain WG_PX PREROUTING
# ensure_chain WG_PX OUTPUT


ensure_line() {
  file=$1
  line="$2"
  grep -qF -- "$line" $file || echo $line >> $file
}

same_in_out() {
  fw_if=$1
  fw_table=$1_table
  mk_value=$2

  # wireguard
  wg-quick down $fw_if
  wg-quick up $fw_if

  # route
  ensure_line /etc/iproute2/rt_tables "$mk_value $fw_table"
  ip route flush table $fw_table
  ip route add default dev $fw_if table $fw_table
  existing_rule_count=$(ip rule list fwmark $mk_value | wc -l)
  for i in $(seq 1 $existing_rule_count)
  do
    ip rule delete fwmark $mk_value
  done
  ip rule add fwmark $mk_value table $fw_table

  # iptable markers
  iptables -t mangle -I WG_PX_PREROUTING -i $fw_if -j CONNMARK --set-mark $mk_value
  # OUTPUT only for host itself, but it's using docker here
  # iptables -t mangle -I WG_PX_OUTPUT     -m connmark --mark $mk_value -j CONNMARK --restore-mark
  iptables -t mangle -I WG_PX_PREROUTING -i $docker_if -m connmark --mark $mk_value -j CONNMARK --restore-mark
}


same_in_out wg_vps    101

```
