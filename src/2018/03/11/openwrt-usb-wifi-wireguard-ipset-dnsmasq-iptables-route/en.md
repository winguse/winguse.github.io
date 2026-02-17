---
title: "Open WRT / Wireguard / IPSet / Route"
date: 2018-03-11 15:35:00 +0800
---

I will skip the flashing part. Before installing anything, run an update first (the package cache information is not preserved after each reboot):

```shell
$ opkg update
```

## USB Wi-Fi adapters

I had a `TP-WN725N` in hand and needed to install a driver for it:

```shell
$ opkg install kmod-rtlwifi-usb kmod-rtl8192cu
```

How did I find this? I looked up [the chipset for this device](https://wikidevi.com/wiki/TP-LINK_TL-WN725N_v1), which is `RTL8188CUS`, then searched for `RTL*` in the packages directory. This one looked suspicious, I installed it, and it turned out to work.

I also had a `TL-WN821N`, and I used the same approach to install the chipset driver:

```shell
$ opkg install opkg install kmod-ath9k-htc
```

This chipset seems fairly common; [it is also listed in the OpenWRT wiki](https://wiki.openwrt.org/doc/howto/wireless.overview).

## Wireguard

Install it:

```shell
$ opkg install wireguard
```

Create a configuration directory (actually not strictly necessary):

```shell
$ mkdir /etc/wireguard
```

Generate a key:

```shell
$ wg genkey
<KEY_STD_OUTPUT>
```

Create a configuration file and save it to `/etc/wireguard/wg0.conf`:

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

In the configuration above, replace `<KEY_STD_OUTPUT>` with the value generated earlier. The `Peer` section should also match your server configuration. To deal with the router itself being behind NAT, adding `PersistentKeepalive = 25` can reduce problems with re-handshaking.

Before `exit 0` in `/etc/rc.local`, add the following (if you want to test it or make it take effect immediately, you can run it once first):

```shell
ip link add dev wg0 type wireguard
ip address add dev wg0 192.168.0.2/24
wg setconf wg0 /etc/wireguard/wg0.conf
ip link set up dev wg0
```

Above, `192.168.0.2/24` needs to match your server configuration.

That way the network will come up automatically on every boot.

Then go to the web UI and configure the new interface and firewall there as well (in theory this can be done from the command line too, but I was too lazy to bother):

![Create wg0 interface](/images/2018-03-11-create-wg0-interface.png)

![Create Forward Rule](/images/2018-03-11-create-forward-rule.png)

## DNS-based routing

The basic idea is this:

1. Use `dnsmasq` together with `ipset` to create a set of destinations that need special routing
2. Use `iptables` to mark packets for that `ipset` set (`fwmark`)
3. Use `ip route` to route based on that mark

First, install the full version of dnsmasq and ipset:

```shell
$ opkg install dnsmasq-full --force-overwrite
$ opkg install ipset iptables-mod-nat-extra
```

Create a new routing table by editing `/etc/iproute2/rt_tables` and adding one line:

```
200 freetable
```

Before `exit 0` in `/etc/rc.local`, add:

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

The final line adds routing for the DNS server’s address, which is necessary for well-known reasons.

Configure dnsmasq so that DNS resolution writes the results into the corresponding ipset. By habit, I prefer to keep config files separate, so first modify `/etc/dnsmasq.conf` and add this line at the end:

```
conf-dir=/etc/dnsmasq.d
```

Create that directory:

```
$ mkdir /etc/dnsmasq.d
```

Create a config file specifically for ipset, for example `/etc/dnsmasq.d/freeset.conf`:

```
server=/.google.com/8.8.8.8 # use 8.8.8.8 for google.com resolve
ipset=/.google.com/freeset # add all resoved results to ipset freeset
```

Add as many pairs of lines as you like for your favorite domains. Restart, and it should work.

---

Update:

Considering the problem of automatic traffic splitting across multiple nodes, testing showed that the `mwan` package can be used, and this package also comes with a Web UI.

Functionally, everything after the `iptables` part above can be omitted (just keep `ipset`). A configuration under the path `/cgi-bin/luci/admin/network/mwan/advanced/mwanconfig` in the UI can look like this:

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

One thing worth mentioning is that this seems to be an incomplete Layer 2 implementation, so Wireguard cannot specify the port used for ping. As a result, commands like `ping -I wg0 192.168.0.1` always fail. So it is a pity that automatic discovery cannot be used. Still, with the configuration above, when one node goes down, the balance policy still seems to work.

2017-03-13 Update: After carefully reading the documentation, I found that this can actually still be done. In the `/usr/sbin/mwan3track` script, just remove the `-I $2` from the `ping` command. But this is only a special-case use here, because it can only be used to check the gateway. After all, if you are checking a public IP address and do not specify the egress interface, you cannot know whether the result is valid. Perhaps it could be made smarter.
