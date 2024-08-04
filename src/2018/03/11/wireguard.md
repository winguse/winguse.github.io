---
title: "Wireguard 配置指南"
date: 2018-03-11 16:35:00 +0800
---

最近沉迷网络，<del>日渐憔悴</del>（大误）。遂发现一神器，正是我梦寐以求的 XXX to UDP 方案。

虽然早有 `L2TP` 驰骋于世间，可是：

- `IPSec` 握手如此麻烦，还常常受到众所周知的原因干扰，让人无比心痛
- 又曰 `L2TP` 的服务器啊，配置起来真太麻烦了（虽然有脚本也不能说麻烦了）
- 更让人心痛的是，`L2TP` 的客户端也不走心啊，随便搞一个什么强壮的天鹅（ `StrongSwan` ），想想都觉得疼

简单说，[Wireguard](https://www.wireguard.com/install/) 基本就是盯着我的痛点的一个项目：

- 一个 RTT 就可以完成握手（[白皮书](https://www.wireguard.com/papers/wireguard.pdf)提到防范 DDOS 可能要两个）
- 安装配置都好简单，客户端、服务端其实是对称的
- 底层用 UDP，根本没有 TCP over TCP 的问题了（TCP fast open 是什么？能吃嘛？）
- 内核态效率还真的很高（不过这个也有更严重的安全问题，不过作者说得也不错，4000 行代码的实现，没有动态内存分配的问题，安全问题还是很好审计的。嗯…不过目前我也没仔细看代码。新东西，期待早日官方软件源收录。）

OK，安装（其实可以参考[官方文档](https://www.wireguard.com/install/)）：

```Shell
$ sudo add-apt-repository ppa:wireguard/wireguard
$ sudo apt-get update
$ sudo apt-get install wireguard
```

在装一个内核的头：

```shell
$ uname -a # check the kernel version
$ sudo apt search linux-headers-XXXXX # XXX is your version
$ sudo apt install linux-headers-YYYYY
```

搞一个 Key：

```
$ wg genkey
<Private_Key>
```

配置 `/etc/wireguard/wg0.conf`：

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

启用（命令放到 `/etc/rc.local` 每次启动就都没问题了）：

```shell
$ sudo sysctl -w net.ipv4.ip_forward=1
$ sudo wg-quick up wg0
```

（如果没有 `wg-quick` 可以按照官方文档一步步来。）

跑一下看看情况：

```shell
$ wg
interface: wg0
  public key: <Public_Key>
  private key: (hidden)
  listening port: 4321
```

将 `Public_Key` 填到另外一个电脑就 OK 啦！

> 本文配合 [Open WRT / Wireguard / IPSet / Route](/2018/03/11/openwrt-usb-wifi-wireguard-ipset-dnsmasq-iptables-route.html) 食用效果更佳。
