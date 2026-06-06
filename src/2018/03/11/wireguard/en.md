---
title: "Translated English Version"
date: 2018-03-11 16:35:00 +0800
---

translated text，<del>translated text</del>（translated text）。translated text，translated text XXX to UDP translated text。

translated text `L2TP` translated text，translated text：

- `IPSec` translated text，translated text，translated text
- translated text `L2TP` translated text，translated text（translated text）
- translated text，`L2TP` translated text，translated text（ `StrongSwan` ），translated text

translated text，[Wireguard](https://www.wireguard.com/install/) translated text：

- translated text RTT translated text（[translated text](https://www.wireguard.com/papers/wireguard.pdf)translated text DDOS translated text）
- translated text，translated text、translated text
- translated text UDP，translated text TCP over TCP translated text（TCP fast open translated text？translated text？）
- translated text（translated text，translated text，4000 translated text，translated text，translated text。translated text…translated text。translated text，translated text。）

OK，translated text（translated text[translated text](https://www.wireguard.com/install/)）：

```Shell
$ sudo add-apt-repository ppa:wireguard/wireguard
$ sudo apt-get update
$ sudo apt-get install wireguard
```

translated text：

```shell
$ uname -a # check the kernel version
$ sudo apt search linux-headers-XXXXX # XXX is your version
$ sudo apt install linux-headers-YYYYY
```

translated text Key：

```
$ wg genkey
<Private_Key>
```

translated text `/etc/wireguard/wg0.conf`：

```ini
[Interface]
ListenPort = 4321
PrivateKey = <Private_Key>
Address = 192.168.0.1/24
PostUp = iptables --wait 120 -t nat -A POSTROUTING -s 192.168.0.0/24 -o ens3 -j MASQUERADE && iptables --wait 120 -A FORWARD -s 192.168.0.0/24 -j ACCEPT
PreDown = iptables --wait 120 -t nat -D POSTROUTING -s 192.168.0.0/24 -o ens3 -j MASQUERADE && iptables --wait 120 -D FORWARD -s 192.168.0.0/24 -j ACCEPT
Table = off

[Peer]
PublicKey = <Client_Public_Key>
AllowedIPs = 192.168.0.2/32
```

translated text（translated text `/etc/rc.local` translated text）：

```shell
$ sudo sysctl -w net.ipv4.ip_forward=1
$ sudo wg-quick up wg0
```

（translated text `wg-quick` translated text。）

translated text：

```shell
$ wg
interface: wg0
  public key: <Public_Key>
  private key: (hidden)
  listening port: 4321
```

translated text `Public_Key` translated text OK translated text！

> translated text [Open WRT / Wireguard / IPSet / Route](/2018/03/11/openwrt-usb-wifi-wireguard-ipset-dnsmasq-iptables-route.html) translated text。
