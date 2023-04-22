---
layout: post
title: "DNAT 保留客户端 IP 且源进源出"
date: 2023-04-21 21:30:00 +0000
---

最近搞了一个对称的宽带，所以想把一些服务挪到家里。。毕竟可信计算这种东西，还是跑自己的硬件比较好。

如果只是简单做端口映射，那么家里的服务器是看不到客户端实际的地址的，所以想搞点事情。这个事情应该也不算少见，我也鼓捣过 iptables，我其实很早就写好了服务器的 DNAT 了，就是死活调不通。

```bash
#!/bin/sh

sysctl -w net.ipv4.ip_forward=1
iptables -P FORWARD DROP
iptables -F FORWARD
iptables -t nat -F

pub_addr=1.2.3.4
prv_addr=192.168.222.2
pub_if=eth0
prv_if=wg_px
proto=tcp
bind_port=5201

iptables -t nat -A PREROUTING -p $proto -d $pub_addr --dport $bind_port -j DNAT --to $prv_addr
iptables -t nat -A POSTROUTING -p $proto -s $prv_addr -j SNAT --to $pub_addr

iptables -I FORWARD -p $proto -i $pub_if -o $prv_if -d $prv_addr --dport $bind_port -j ACCEPT
#iptables -I FORWARD -p $proto -i $prv_if -o $pub_if -s $prv_addr --sport $bind_port -j ACCEPT
iptables -I FORWARD -m state --state NEW,RELATED,ESTABLISHED -j ACCEPT

# tcpdump -i $prv_if $proto port $bind_port
```

上面这段写完以后，就发现一个很奇怪的事情，回程的数据包不知道为啥有给我重新发到了 wireguard 上面了。我搞不定，也没搜到结果。。最后想着这个不会是个 bug 吧，然后换了一个机器，就发现没问题了。。害我没了 2 小时。。

下面就是用了确保本地数据包能正确路由的脚本：

```bash
#!/bin/sh

fw_gw=192.168.222.1
fw_if=wg_px
fw_table=fwio
mk_value=75

ip route add default via $fw_gw dev $fw_if table $fw_table

iptables -t mangle -I PREROUTING -i $fw_if -j CONNMARK --set-mark $mk_value
iptables -t mangle -A OUTPUT     -m connmark --mark $mk_value -j CONNMARK --restore-mark
ip rule add fwmark $mk_value table $fw_table

```
