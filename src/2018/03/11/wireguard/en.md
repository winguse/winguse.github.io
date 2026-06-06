---
title: "Wireguard Configuration Guide"
date: 2018-03-11 16:35:00 +0800
---

Lately I have been obsessed with networking, <del>growing more haggard by the day</del> (not really). So I discovered a magical tool — exactly the XXX-to-UDP solution I had been dreaming of.

Although `L2TP` has long been roaming the world, there are still some pains:

- The `IPSec` handshake is so troublesome, and it is often interfered with for well-known reasons, which is heartbreaking.
- As for `L2TP` servers, configuring them is really too much trouble (though with scripts it is hard to say it is *that* troublesome).
- Even more heartbreaking, the `L2TP` clients are not very thoughtful either. Just thinking about installing something like `StrongSwan` already hurts.

Simply put, [Wireguard](https://www.wireguard.com/install/) is basically a project aimed directly at my pain points:

- The handshake can be completed in one RTT (the [whitepaper](https://www.wireguard.com/papers/wireguard.pdf) mentions that defending against DDoS may require two)
- Installation and configuration are both very simple, and the client and server are essentially symmetric
- It uses UDP underneath, so there is no TCP-over-TCP problem at all anymore (what is TCP Fast Open? Can you eat it?)
- Its kernel-space efficiency is genuinely high (though that also comes with more serious security concerns, but the author makes a fair point: with an implementation of only 4,000 lines of code and no dynamic memory allocation, security issues are still fairly easy to audit. Hmm... though I have not looked through the code carefully myself yet. It is a new thing; hopefully it gets included in official package sources soon.)

OK, installation (you can of course refer to the [official documentation](https://www.wireguard.com/install/)):

```Shell
$ sudo add-apt-repository ppa:wireguard/wireguard
$ sudo apt-get update
$ sudo apt-get install wireguard
```

Install the kernel headers as well:

```shell
$ uname -a # check the kernel version
$ sudo apt search linux-headers-XXXXX # XXX is your version
$ sudo apt install linux-headers-YYYYY
```

Generate a key:

```
$ wg genkey
<Private_Key>
```

Configure `/etc/wireguard/wg0.conf`:

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

Enable it (put these commands into `/etc/rc.local` and it will be fine after every boot):

```shell
$ sudo sysctl -w net.ipv4.ip_forward=1
$ sudo wg-quick up wg0
```

(If you do not have `wg-quick`, just follow the official documentation step by step.)

Run this to check the status:

```shell
$ wg
interface: wg0
  public key: <Public_Key>
  private key: (hidden)
  listening port: 4321
```

Fill `Public_Key` into the configuration on the other computer and you are done!

> This post works even better together with [Open WRT / Wireguard / IPSet / Route](/2018/03/11/openwrt-usb-wifi-wireguard-ipset-dnsmasq-iptables-route.html).
