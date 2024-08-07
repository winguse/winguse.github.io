---
title: "安全上网的迷思"
date: 2021-07-29 21:19:00 +0800
---

世界上有很多好人，但是也有坏人嘛，互联网也不例外，所以无论在哪里，都有安全上网的需求。这东西，在中国大陆，有不可描述的原因，这个需求也很大。

八仙过海，各显神通，市面上有很多安全上网的办法，并且办法一直在变多。

最开始，也最容易被人找到的办法，就是使用 HTTP 代理，网上也能找到很多免费的服务器。这种办法，在 HTTPS 没有完全普及的年代，基本就是把自己的所有信息都出卖给了代理服务器，同时，自己跟代理服务器之间的通讯也是明文的。哪怕当今，HTTPS 相对已经很普及了，但是 HTTP 代理也会暴露你访问的域名。类似的，还有明文的 SOCKS 代理。

大约 9 年前，著名的 Shadowsocks 项目启动，开启了加密代理的时代。最开始，项目一度非常成功，但是由于密码套件使用存在的一些问题，使得 Shadowsocks 变得容易被检测，并且协议虽然没有特别的握手特征，但是就像一辆涂黑窗口行驶在马路上的面包车，Shadowsocks 的流量也容易被怀疑和屏蔽。因此，Shadowsocks 也出现了各种混淆的办法。类似的，还有 V2Ray 这个项目，虽然解决了很多 Shadowsocks 的问题，并且功能更加强大，但是配置起来也过分复杂。最近一些年，又出现了 Trojan 这个项目，直接使用 TLS 进行伪装，不过也未能逃脱配置过于复杂的问题。

VPN 方面，市面上也有很多方案。比较有代表性的比如 PPTP，但是由于安全问题，PPTP 已经很少见了；又比如 L2TP/PSK-IPSec，这个协议还广泛存在，但是由于 IPSec 握手有各种问题或者被屏蔽，并不是特别稳定的存在。近些年，Wireguard 以其简练巧妙的设计打动了不少人，并且性能非常好。但是 Wireguard 跟别的 VPN 一样，UDP 作为中国互联网的二等公民，过得非常难；而且 Wireguard 也有明显的数据包特征，可以被轻易地识别。VPN 其实也是有 TLS 的方案的，那就是微软的 SSTP，但是这个方案部署起来比较困难，原生的你需要用 Windows Server，开源的实现也不多（SoftEther 是其中一个），暴露的端口也不好隐藏 VPN 服务。

在隐藏代理或者 VPN 意图，以及避免 ISP QoS 的路上，代理和 VPN 最终都指向 TLS，伪装成正常的网站服务。但是这两个其实都没特别好的实现，所以最近一些日子，我琢磨琢磨着，自己写了好多工具。到今天，我发现，其实写这些工具并没多难，而且上面提到的一些工具，我觉得都搞得大而全，搞得太复杂了。实现这些工具，其核心其实并不需要多少代码或者逻辑。

最开始的，我们使用的是普通 HTTP 代理，但是其实与代理服务器之间的连接，也是可以建立 TLS 通讯的，这样可以隐藏正在使用代理的情况，于是我写了 [go-shp](https://github.com/winguse/go-shp) 这个项目。服务端并非没有现成的实现，比如 Caddy 1.x 就是一个。但是支持的客户端不多，比如操作系统就没支持的，浏览器我也就看到 Chrome 支持（Firefox 或许也支持），所以我也撸了一个本地的转发代理。而既然 Chrome 支持，我也写了一个浏览器插件，不过步子迈得有点大，自动检测并使用代理那个功能写了很多代码却没写多好。

不过 HTTP 代理天生是没办法转发 TCP 以外的流量的。有这种需求的时候，我用的是 Wireguard。直接用原生的 Wireguard 确实太容易被识别了，所以我撸了一个 [udp-xor](https://github.com/winguse/udp-xor)。但是只是 xor 还是有特征的，所以我在练习 rust 的时候，写了 [udp-prepend](https://github.com/winguse/udp-prepend) 这个项目。UDP 虽好，但是 QoS 啊，所以我写了 [ws-udp](https://github.com/winguse/ws-udp) 把 UDP 流量塞进 WebSocket 里头，这样就顺便可以使用 TLS 伪装了。这却没办法地引入了 TCP over TCP 的问题，但是，这也没好多解决方案了。不过，Wireguard 本身已经有一层加密了，TLS 的 Websocket 再做一次确实让我不爽，我开始想念 SSTP 的好了。但正如前面所言，市面上并没有特别好的实现，于是我又动手写了 [ws-tun](https://github.com/winguse/ws-tun)。

我曾经一度想实现一个 SSTP 的 server 的，但是这个协议还是稍微有点复杂，并且不大好跟正常的流量区分开。为此，我选择直接自己做一个 tun 或者 tap VPN。坦白说，websocket 的开源实现我也是找到过的，但是有一个用的是一个小众的语言，还有一个项目不支持 TLS 被我放弃了，而且，他们确实写得有点复杂。tun / tap 之间，tap 我觉得没有必要，而且它需要 root 权限才能跑，所以我决定写一个 tun 就好了。tun 的数据包传输，选择 websocket 也是很自然的，研究 websocket 的协议，其实它的 overhead 不算太大，有了它，我也不需要自己实现一套分片的逻辑了。tun 的调用，我也没自己写，直接把 Cloudflare 的 boring-tun 项目抄了过了，改吧改吧就有了。唯一比较坑我的地方，就是 rust 的编写过程，要编译通过非常痛苦，并且异步改造也费了我很多时间。这个项目实测可以在 macOS 和 Linux 上和谐运行。至于配置，服务端和客户端只需要商量好一个 websocket 的地址就可以了，别的都不需要另外配置。我这里把服务端和客户端都写一个程序里头了，其实这个并不是特别好的选择，因为服务端我是设计为放到 nginx 之类的后面的，所以 TLS 加密是不需要配置的，搞得服务端体积也不小；客户端没办法，就包含了 TLS 所需要的包。

但 ws-tun 的移动端之路却不是那么容易，因为我没写过移动端端程序。不过这周，我花了一点时间，写了 [ws-tun-android](https://github.com/winguse/ws-tun-android)，我发现 Android 端 VPN 还是非常简单的，Google 给了一个 ToyVPN 的项目，改吧改吧又能用了。但是昨晚我准备去写 iOS 的时候，发现并没那么容易，首先开发者账户是必须的，然后 NetworkExtension 只能给企业用户了？我就 GG 告辞了。

Anyway 了，过一段时间，或许我并不需要再折腾这个事情了，谨以此文作为折腾网络多年的总结吧，从用别人的服务，到自己用别人到代码搭一个服务，最后到自己动手写代码实现一个服务，谢谢 GFW 教会了我许多。
