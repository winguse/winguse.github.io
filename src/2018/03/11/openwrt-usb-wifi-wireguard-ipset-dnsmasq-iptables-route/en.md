---
title: "Open WRT / Wireguard / IPSet / Route"
date: 2018-03-11 15:35:00 +0800
---

translated text。translated text，translated text update (translated text package cache translated text)：

```shell
$ opkg update
```

## USB translated text

translated text `TP-WN725N` translated text：

```shell
$ opkg install kmod-rtlwifi-usb kmod-rtl8192cu
```

translated text，translated text[translated text](https://wikidevi.com/wiki/TP-LINK_TL-WN725N_v1)，translated text `RTL8188CUS` ，translated text packages translated text `RTL*` ，translated text，translated text。

translated text `TL-WN821N` translated text，translated text：

```shell
$ opkg install opkg install kmod-ath9k-htc
```

translated text，[translated text OpenWRT translated text Wiki translated text](https://wiki.openwrt.org/doc/howto/wireless.overview)。

## Wireguard

translated text：

```shell
$ opkg install wireguard
```

translated text（translated text）：

```shell
$ mkdir /etc/wireguard
```

translated text Key：

```shell
$ wg genkey
<KEY_STD_OUTPUT>
```

translated text，translated text `/etc/wireguard/wg0.conf`：

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

translated text，translated text `<KEY_STD_OUTPUT>` translated text，`Peer` translated text，translated text，translated text NAT translated text，translated text `PersistentKeepalive = 25` translated text。

translated text `/etc/rc.local` translated text `exit 0` translated text（translated text，translated text，translated text）：

```shell
ip link add dev wg0 type wireguard
ip address add dev wg0 192.168.0.2/24
wg setconf wg0 /etc/wireguard/wg0.conf
ip link set up dev wg0
```

translated text， `192.168.0.2/24` translated text。

translated text。

translated text，translated text interface translated text firewall （translated text，translated text）：

![Create wg0 interface](/images/2018-03-11-create-wg0-interface.png)

![Create Forward Rule](/images/2018-03-11-create-forward-rule.png)

## translated text DNS translated text route

translated text：

1. `dnsmasq` translated text `ipset`，translated text
2. `iptables` translated text `ipset` translated text（`fwmark`)
3. `ip route` translated text

translated text，translated text dnsmasq translated text ipset：

```shell
$ opkg install dnsmasq-full --force-overwrite
$ opkg install ipset iptables-mod-nat-extra
```

translated text，translated text `/etc/iproute2/rt_tables` translated text：

```
200 freetable
```

translated text `/etc/rc.local` translated text `exit 0` translated text：

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

translated text DNS translated text，translated text，translated text。

translated text dnsmasq ，translated text DNS translated text ipset 。translated text，translated text，translated text，translated text `/etc/dnsmasq.conf`，translated text：

```
conf-dir=/etc/dnsmasq.d
```

translated text：

```
$ mkdir /etc/dnsmasq.d
```

translated text ipset translated text，translated text `/etc/dnsmasq.d/freeset.conf` ：

```
server=/.google.com/8.8.8.8 # use 8.8.8.8 for google.com resolve
ipset=/.google.com/freeset # add all resoved results to ipset freeset
```

translated text，translated text。translated text，translated text。

---

translated text：

translated text，translated text `mwan` translated text，translated text，translated text Web UI。

translated text，translated text `iptables` translated text（translated text `ipset`）。translated text `/cgi-bin/luci/admin/network/mwan/advanced/mwanconfig` translated text：

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

translated text，translated text 2 translated text，translated text Wireguard translated text ping translated text，translated text `ping -I wg0 192.168.0.1` translated text。translated text，translated text。translated text，translated text，blance translated text。

2017-03-13 Update: translated text，translated text，translated text `/usr/sbin/mwan3track` translated text，translated text `ping` translated text `-I $2` translated text。translated text，translated text，translated text。translated text。
