---
layout: post
title: "Across the Great Wall"
date: 2017-06-20 12:00:00 +0800
---

<!-- open this file in Marp (https://yhatt.github.io/marp/) -->

# Across the Great Wall we can reach very corner in the world.

> The first email sent in China, sending from Beijing to German, at 21:07, September 14<sup>th</sup>, 1987.

---

> 1987年9月14日21时07分
> 中国第一封电子邮件
> 从北京发往德国
> “越过长城，走向世界”
>
> -- 摘自 QQ 邮箱首页

---

# How the Great Firewall of China (GFW) works

- HTTP sniffing
- DNS spoofing
- IP blacklist
- Ports blocking (mostly for VPNs)
- Interrupt encrypted protocol

---

# HTTP sniffing

> Mostly used in the early days, for instance, around 2008.

If your HTTP URL or content contains sensitive keywords, your connection will be reset. The firewall will set TCP RESET signal to both ends of the connection. What you observe in Chrome will be `TCP_CONNECTION_RESET`.

The reset status will keep sending in the following several minutes, even if you do not contains sensitive keywords.

---

# HTTP sniffing (solution)

- It's said that if both ends ignore this reset signal, the connection can continue.

or

- It's also said that, if your HTTP heads contains extra prepended blank lines, GFW will ignore that package

or

- Encrypt the data being transferred
  > base64 is enough, for instance, a PHP web proxy

or

- HTTPS, encrypt the whole Internet: [Let's encrypt](https://letsencrypt.org) <del>/ StartSSL (WoSign)</del>

---

# DNS spoofing

You will get random IP as A result when you query for a blocked domain, i.e., www.google.com.

And as you know, DNS query is layer by layer, so the DNS in the whole country will always return the polluted result.

```
$ dig www.google.com @8.8.8.8
```

---

# DNS spoofing (solution)

- <del>query DNS via TCP</del> (but now you got TCP reset for blocked domains)
  ```
  $ dig www.google.com @8.8.8.8 -p 53 +vc
  ```
- hosts file: [Smart Hosts](https://github.com/smarthosts/smarthosts)
- via the other UDP ports (only works for [Open DNS](https://www.opendns.com/))
  > 208.67.222.222
  > 208.67.220.220
  ```
  $ dig www.google.com @208.67.222.222 -p 5353 +vc
  ```

---

# IP blacklist

Some of the services have been blocked as IP blacklist, that means, no connection will be allowed.

Examples include Google, twitter, facebook, etc,

---

# IP blacklist (solution)

- Proxy
    - Socks5, HTTP
    - GoAgent
    - SSH dynamic forward
    - Shadowsocks
- VPN
    - sshuttle
    - <del>PPTP</del>
    - L2TP (IPSec-PSK)
    - SSTP

---

# Ports blocking

Some of the ports are being blocked or interrupted in China, for instance:

- L2TP: IPsec 500 / 4500, or 1701 (UDP), or 1723 (TCP)
- SSH: 22
- SSTP: blocked the GRE protocol

---

# Ports blocking (solution)

- L2TP: usually blocked in the IPsec handshake, you may try to connect via 4G and then connect to WiFi (data is being transferred as UDP after handshake).
- SSH: try to change your port
- PPTP is insecure

Or, use:
- SSTP (it's not likely they will block all HTTPS traffic)
- Shadowsocks

---

# Interrupt encrypted protocol

> GFW may interrupt encrypted protocal, VPN, SSL.

It's said that the CA of CNNIC, had signed some certificates of Google / Facebook for decrypt the SSL traffic.

You may also think about what's the certificate of 12306.cn looks like.

---

# General Solutions

---

# Socks5, HTTP

- Search for free or paid service
- build your own server

> insecure, not recommended

BTW: HTTPS traffic send via HTTP proxy is using [CONNECT tunnel](https://en.wikipedia.org/wiki/HTTP_tunnel#HTTP_CONNECT_tunneling), which sends as TCP.

---

# [GoAgent](https://github.com/goagent/goagent) or [GappProxy](https://code.google.com/archive/p/gappproxy/)

> Running in Google Application Engine, started in around 2008

- First OSS for GFW
- Free 1GB / node / day, 10 nodes free node
- Fast (use Google's Beijing Data Center, died recent years)
- Not support HTTPS (self-signed)

---

# SSH dynamic forward

> `ssh -D` will open a port on local machine act as Socks5 proxy.

```
$ ssh 111.222.33.44 -D 7777 # or DynamicForward in config
```

NOTE:

- Some browsers (Firefox / IE) will forward TCP traffic to Socks5, which DNS will be quired locally. You may need some configurations ([Firefox](https://superuser.com/questions/103593/how-to-do-dns-through-a-proxy-in-firefox)), or [you can build HTTP proxy on top of Socks5](https://superuser.com/questions/423563/convert-http-requests-to-socks5).

- [`ssh -D` is not a full featured socks5 proxy, which does not support UDP](https://superuser.com/questions/639425/linux-socks5-tunneling-not-working-with-udp-traffic)

---

# Shadowsocks (SS)

> aiming to implement a proxy protocol without signature, so that it can hardly being detected and blocked

- server side: `$ sudo apt install shadowsocks-libev` (after 16.04)

- client side: [Windows](https://github.com/shadowsocks/shadowsocks-windows/releases) / [iOS](https://itunes.apple.com/cn/app/wingy-proxy-for-http-s-socks5/id1178584911?mt=8) / [Android](https://play.google.com/store/apps/details?id=com.github.shadowsocks) / [MacOS](https://github.com/zhuhaow/SpechtLite) ...
   including routers ([miwifi](https://github.com/blademainer/miwifi-ss)), use `iptable` to     forward `TCP` traffic to `socks5` (similar project: [RedSocks](http://darkk.net.ru/redsocks/))

Also read [SS vs SSr](https://www.librehat.com/about-shadowsocks-r-and-the-security-of-shadowsocks/):

---

# Rule-based proxying

> You won't want to send all your traffic via proxy, it's slow for domestic destinations!

---

# [PAC (Proxy Auto-Config) script](https://en.wikipedia.org/wiki/Proxy_auto-config)

```javascript
function FindProxyForURL(url, host) {
  // our local URLs from the domains below example.com don't need a proxy:
  if (shExpMatch(url,"*.example.com/*")) {
      return "DIRECT";
  }
  if (shExpMatch(url, "*.example.com:*/*")) {
      return "DIRECT";
  }

  // URLs within this network are accessed through
  // port 8080 on fastproxy.example.com:
  if (isInNet(host, "10.0.0.0",  "255.255.248.0"))    {
      return "PROXY fastproxy.example.com:8080";
  }

  // All other requests go through port 8080 of proxy.example.com.
  // should that fail to respond, go directly to the WWW:
  return "PROXY proxy.example.com:8080; DIRECT";
}
```

I don't think you want to do it yourself all the time.

---

## Chrome Plugin

[Proxy SwitchyOmega](https://chrome.google.com/webstore/detail/padekgcemlokbadohgkifijomclgjgif)

and

## GFW list

https://github.com/gfwlist/gfwlist


> I seldom enable this plugin, but I export the rules as a `.pac` file, and set that file as global config.
> And what's more, the Windows / Mac version of ss will do things like this for you.


---

# Application layer is not enough

> for instances, in the terminal, or other applications that not working or working well with HTTP / SOCKS proxy

---

# [sshuttle](https://sshuttle.readthedocs.io/en/stable/)

> `sshuttle` is perfect solution if you just want TCP traffic cross the GFW, it works when you have a ssh server.

- no server side installation (only python is requried, server side code is send by client)
- support remote DNS by `--dns`
- stable: SSH is comparing not likely to be blocked


---

# VPNs

> if you need UDP, ICMP, or other stuffs, you still need VPNs

- <del>PPTP</del> is insecure.
- L2TP looks good
- SSTP is recommanded

---

# VPN server

- [Windows Server](https://blogs.msdn.microsoft.com/lighthouse/2013/07/30/how-to-deploy-sstp-and-l2tp-vpn-in-windows-azure-windows-server-2012/)
- [SoftEther](https://www.softether.org)
  This is a full solution for
  - Open VPN
  - L2TP (IPsec-PSK or RAW)
  - SSTP
  > It also implemented VPN as virtual devices (ether, hub) in Windows (or Linux?), which is great.
  > Open source project, but be aware: according to privacy rules, it's restricted by Japanese goverment.
- [Open VPN](https://openvpn.net/)

> Enable Google BBR in Linux Kernal 4.9

---

# Routing on top of VPN

- Windows: `route add <IP> mask <MASK, 255.255.0.0> <GATEWAY> metric 25` ([script](winguse.com//0/win_router_add.php))
- Mac: `/sbin/route add -net 111.222.0/16 -interface $1` or add to `/etc/ppp/ip-up`

CN IP arrangement: http://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest

---

# Anonymous notes

- Proxy is usually not anonymous if it strictly follow [HTTP (RFC 2616)](https://www.ietf.org/rfc/rfc2616.txt)
- IP address is static
- Screen resolution / cookies / User Agent / Not modified header ... may indidates your identity

The only valid solution: [Tor](https://torproject.org)

---

# Thank you!
