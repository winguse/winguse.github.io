---
layout: post
title: "Ubuntu在启用UFW的情况下，设置iptables规则"
date: 2012-07-21 01:06:20 +0000
---
昨天，有个需求，就是要屏蔽OJ服务器(ubuntu linux server)上面对于某个用户的网络访问权限，例如说，运行judge的账户。

服务器打开着ufw的，然后试图运行：

```
iptables -A OUTPUT -m owner --uid-owner judge -j REJECT --reject-with icmp-port-unreachable
```

是不行的。当把ufw关掉之后，这个命令有效。折腾了很久，还是没把问题解决。

看ufw手册($man ufw)，向手册的维护者Jamie Strandboge发了电子邮件，想不到晚上就收到回复了。

```
You need to add the rule to /etc/ufw/before.rules. See ‘man
ufw-framework’ for details.
```

非常感激，自己折腾了一下，修改 /etc/ufw/before.rules 以及 /etc/ufw/before6.rules ，在# End required lines之后添加：

```
#HUSTOJ security
-A ufw-before-output -m owner --uid-owner judge -j REJECT --reject-with icmp-port-unreachable
```

然后运行：

```
sudo ufw reload
```

防火墙规则就生效了。

之前有个DNS端口转发的规则不能生效，估计也是这个问题，回头也整整～
