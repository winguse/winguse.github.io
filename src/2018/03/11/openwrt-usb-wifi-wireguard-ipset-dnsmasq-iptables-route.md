---
title: "Open WRT / Wireguard / IPSet / Route"
date: 2018-03-11 15:35:00 +0800
---

刷机不提。装东西前，先 update (每次重启这个 package cache 的信息并不会保留)：

```shell
$ opkg update
```

## USB 网卡

手里有一个 `TP-WN725N` 需要装个驱动：

```shell
$ opkg install kmod-rtlwifi-usb kmod-rtl8192cu
```

这个怎么找到的呢，我是通过查[这个东西的芯片](https://wikidevi.com/wiki/TP-LINK_TL-WN725N_v1)，是 `RTL8188CUS` ，然后在这个 packages 的目录下面找 `RTL*` ，看到这个比较可疑，装上然后发现就好了。

手里还有一个 `TL-WN821N` 同样的套路，装上芯片驱动：

```shell
$ opkg install opkg install kmod-ath9k-htc
```

这个芯片还挺常见的样子，[在 OpenWRT 的 Wiki 里面也有](https://wiki.openwrt.org/doc/howto/wireless.overview)。

## Wireguard

安装：

```shell
$ opkg install wireguard
```

创建配置文件目录（其实也不必要）：

```shell
$ mkdir /etc/wireguard
```

创建个 Key：

```shell
$ wg genkey
<KEY_STD_OUTPUT>
```

创建个配置文件，保存到 `/etc/wireguard/wg0.conf`：

```shell
[Interface]
ListenPort = 4321
PrivateKey = <KEY_STD_OUTPUT>

# server info copy from your server
[Peer]
PublicKey = <YOUR_SERVER_PUBLIC_KEY>
PersistentKeepalive = 25
AllowedIPs = 0.0.0.0/0
Endpoint = 1.2.3.4:1234
```

上文中，请替换 `<KEY_STD_OUTPUT>` 为前面生成的值，`Peer` 的配置也根据你服务器的配置，其中，为了解决路由器本身在 NAT 环境中的问题，加上 `PersistentKeepalive = 25` 可以减少重新握手的问题。

在 `/etc/rc.local` 的 `exit 0` 之前添加（如果你想测试，或者说立刻生效，可以先跑一下）：

```shell
ip link add dev wg0 type wireguard
ip address add dev wg0 192.168.0.2/24
wg setconf wg0 /etc/wireguard/wg0.conf
ip link set up dev wg0
```

上文中， `192.168.0.2/24` 需要根据你服务器的配置有关。

这样每次启动网络就通了。

然后，去界面上配置一下新的 interface 以及 firewall （理论上这个可以用命令行解决的，不过我懒得折腾了）：

![Create wg0 interface](/images/2018-03-11-create-wg0-interface.png)

![Create Forward Rule](/images/2018-03-11-create-forward-rule.png)

## 基于 DNS 的 route

基本思路是这样的：

1. `dnsmasq` 配合 `ipset`，创建一个需要路由的集合
2. `iptables` 对 `ipset` 里面的那个集合打标识（`fwmark`)
3. `ip route` 根据标识进行路由

首先，装一下完整版的 dnsmasq 和 ipset：

```shell
$ opkg install dnsmasq-full --force-overwrite
$ opkg install ipset iptables-mod-nat-extra
```

创建一个新的路由表，编辑 `/etc/iproute2/rt_tables` 添加一行：

```
200 freetable
```

在 `/etc/rc.local` 的 `exit 0` 之前添加：

```shell
ipset -N freeset iphash # new a ip set named freeset
iptables -t mangle -N fwmark
iptables -t mangle -A PREROUTING -j fwmark
iptables -t mangle -A OUTPUT -j fwmark
iptables -t mangle -A fwmark -m set --match-set freeset dst -j MARK --set-mark 1

ip route add default via 192.168.0.1 dev wg0 table freetable
ip rule add fwmark 1 table freetable

ip route add 8.8.8.0/24 via 192.168.0.1 dev wg0
```

最后加上的是 DNS 的地址路由，因为众所周知的原因，这是必须的。

配置 dnsmasq ，让 DNS 解析的时候写入对应 ipset 。习惯性的，还是分开配置文件比较好，所以，先改一下 `/etc/dnsmasq.conf`，最后面加上一行：

```
conf-dir=/etc/dnsmasq.d
```

创建这个目录：

```
$ mkdir /etc/dnsmasq.d
```

创建一个专门为 ipset 准备的配置文件，例如 `/etc/dnsmasq.d/freeset.conf` ：

```
server=/.google.com/8.8.8.8 # use 8.8.8.8 for google.com resolve
ipset=/.google.com/freeset # add all resoved results to ipset freeset
```

两行一组，尽情添加你所爱。重启，应该就好了。

---

更新：

考虑到多节点自动分流的问题，测试发现可以使用 `mwan` 这个包，同时，这个包还带 Web UI。

功能上，上文 `iptables` 后面的部分可以省略（值保留 `ipset`）。界面中 `/cgi-bin/luci/admin/network/mwan/advanced/mwanconfig` 这个路径的一个配置可以长成这样：

```
config rule 'freeset'
  option proto 'all'
  option sticky '0'
  option ipset 'freeset'
  option use_policy 'wg_blanced'

config rule 'default_rule'
  option dest_ip '0.0.0.0/0'
  option proto 'all'
  option sticky '0'
  option use_policy 'default_policy'

config interface 'wg0'
  option enabled '1'
  option reliability '1'
  option count '1'
  option timeout '3'
  option down '3'
  option up '1'
  option interval '3'

config interface 'wan'
  option enabled '1'
  option reliability '1'
  option count '1'
  option timeout '2'
  option interval '5'
  option down '3'
  option up '3'

config policy 'default_policy'
  option last_resort 'default'
  list use_member 'wan_default'

config member 'wan_default'
  option interface 'wan
  option metric '1'

config member 'wg0_default'
  option interface 'wg0'

config policy 'wg_blanced'
  option last_resort 'default'
  list use_member 'wg0_default'
  list use_member 'wg1_default'

config member 'wg1_default'
  option interface 'wg1'

config interface 'wg1'
  option enabled '1'
  option reliability '1'
  option count '1'
  option timeout '2'
  option interval '5'
  option down '3'
  option up '3'

```

值得一提的是，貌似是不完整 2 层实现，所以 Wireguard 不能指定 ping 的端口，所以 `ping -I wg0 192.168.0.1` 类似的命令总是挂的。所以，不能使用自动发现比较可惜。不过上面这个配置，在一个节点挂了，blance 策略貌似还是可以工作的。

2017-03-13 Update: 仔细研读文档后，发现还是可以做到的，在 `/usr/sbin/mwan3track` 这个脚本里头，将 `ping` 的 `-I $2` 去掉就好了。不过这里使用是个特例，因为是只能用于检查网关，毕竟如果是公网的地址你不指定出口的就不能知道是不是有效了。或许还可以改得更智能些。
