---
title: "DNAT with Client IP Preservation and Symmetric Routing"
date: 2023-04-21 21:30:00 +0000
---

I recently got a symmetric broadband connection, so I wanted to move some services back home. For trusted computing workloads, I still prefer running them on my own hardware.

If you only do basic port forwarding, your home server cannot see the real client IP, so I wanted to solve that properly. This is not a rare scenario. I had already written the DNAT rules long ago and had played with iptables many times, but I just could not get it to work.

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

After writing the script above, I hit a strange issue: return packets were somehow being sent back into WireGuard again. I could not fix it and could not find useful search results either. In the end I wondered whether it was a bug, switched to another machine, and everything worked. That cost me two hours.

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
