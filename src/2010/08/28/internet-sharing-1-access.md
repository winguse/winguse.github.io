---
title: "网络共享那些事(一)——共享上网"
date: 2010-08-28 13:43:04 +0000
---

## 前言

新新的博客啊，没什么东西写实在不行，感觉，网络共享这个东西，挺好的，就写些东西吧~

这样写一个专题吧，打算写几篇连续的，由于我也只是一个菜鸟，所以，我会用尽可能通俗的语言写的，当然，我水平有限，还请各路大牛指点啊~

网络，就是用来沟通人与人的，所以，分享，我觉得，就是网络的核心，特别是 Web2.0 的引入，更加强调了个体对网络的贡献，我们可以分享自己生活发生的事，分享自己的看法，发表自己的意见等等……同样的，我们也可以作为读者，通过网络获取信息，改善我们的生活、提高我们的工作效率。

第一篇，就让我分享一下共享上网的一些见解吧。

## 准备

本文仅就 Windows 平台，展开讨论，对于 windows xp 以上的操作系统，可以通用，至于截图，就以我的 Windows7 为例吧。

硬件方面，需要至少两块网卡（后面我也会提一下在一张网卡情况下的设置方法，我们由简入深~）。

## 详细操作

### 设置共享

![打开网络与共享中心](/images/2010-08-28-open_network_config_1.png)

在任务栏右端通知区域，找到网络那个图标（如果没有连上无线网，可能是这样的：![网络图标](/images/2010-08-28-net_ico.png)，当然，网络状态不一样，图标也不一样，如果你实在找不到，一个个图标点一下，总是能够找到上图的情况的），单击，然后点击“打开网络和共享中心”。对于 XP 的用户，可以再桌面上右键点击“网上邻居”，选择“属性”，Vista 的用户跟 Windows7 相似，找到“网络和共享中心”即可，我这里不方便，就不截图了。

![](/images/2010-08-28-open_network_config_2.png)

在窗口右侧，点击“更改适配器设置”。

![网络与共享中心](/images/2010-08-28-net_cnt.png)

此时，你会看到类似上图的情况的界面。根据你现在连接到互联网的是哪一张网卡（例如，你是通过有线网络上网的[校园网，小区网络等]，可以选择“本地连接”，如果你是通过 ADSL 拨号的，选择“宽带连接”之类的图标），在那张网卡上点击邮件，选择属性。

![在互联网接入的连接上点击右键](/images/2010-08-28-right_click_on_lan.png)

我这里是校园网，是“本地连接”。

![共享选项卡](/images/2010-08-28-share_page.png)

在弹出的属性窗口中，转到“共享”选项卡，出现如上图界面。

![](/images/2010-08-28-share_set.png)

在选择一个专用网络连接下拉菜单中，如果你有三张或者以上的网卡，那么你将会看到和我一样的情况，选择其中一张你要共享网络的网卡，即可。如果没有，直接勾上上面两个复选框即可。最后如图：

![](/images/2010-08-28-share_set_1.png)

然后，点击确定，此时弹出一个提示：

![](/images/2010-08-28-share_set_2.png)

你会看到，系统提示你，已经将你要共享出去的那张网卡的地址设置成了"192.168.2.1"(你可能看到不是这个，这个是我的电脑)，如果其他电脑想通过你的电脑上网，只需要和你共享出去的那张网卡连接上就可以了。所以，这里我们可以直接点击“是”。

那么，我们如何把别人的电脑和你的电脑，用你共享出去的网卡连接到一起呢？

### 链路连接

如果你共享出去的是有线网卡，而只需要共享给一个人，一般情况下，用一根网线连接两个网卡就可以解决了，如果不然，可能是网卡的兼容性问题，因为我们平时用的网线是双绞线，如果网卡只支持一种对称接法，就可能造成用网线无法直接连接这种情况，你可以通过一根反转的网线解决，也可以跟多台电脑的办法解决。如果有更多的电脑需要共享，将你的电脑和他们的电脑用交换机、路由之类的网络设备接在一起即可，具体的，你到普通的电脑配件商店就可以找到了。

如果你共享出去的是无线网卡，可以选择的方案有三个：

1. 建立一个临时的点对点无线网
2. 使用无线路由
3. 如果网卡被 windows7 的虚拟网卡支持，使用虚拟网卡创建一个无线热点（充当路由，而且不影响物理网卡的接入）

下面，我就无线网络的第一个和第三个办法详细叙述，至于无线路由的，毕竟不同路由的设置千差百异，大家可以参考说明书。

#### 建立一个临时的点对点无线网

跟上面一样，我们打开“网络和共享中心”，然后，读图时代：

![](/images/2010-08-28-establish_temp_wifi_1.png)

![](/images/2010-08-28-establish_temp_wifi_2.png)

![](/images/2010-08-28-establish_temp_wifi_3.png)

![](/images/2010-08-28-establish_temp_wifi_4.png)

![](/images/2010-08-28-establish_temp_wifi_5.png)

![](/images/2010-08-28-establish_temp_wifi_6.png)

![](/images/2010-08-28-establish_temp_wifi_7.png)

至此，要共享的机器已经设置完成了，然后，在要连网的机器上，我们同样打开网络连接的小对话框，如下：

![](/images/2010-08-28-connect_to_temp_wifi_1.png)

可以看到广告设立的无线网了，选择它，点击连接就可以了。

![](/images/2010-08-28-connect_to_temp_wifi_2.png)

密码是必须的，输入，然后确定即可。由于前面我们使用了默认的 IP 地址设置，所以连接上，只要默认的设置（自动获得网络地址）就可以连接上了，如果不行，参考本文最后一个部分，手动配置网络地址。

### 通过虚拟网卡设置无线热点

这个办法需要相当好的人品了，首先，必须是 windows7，而且，需要你的网卡也支持。如何知道我们的网卡是否被支持呢？前面我们打开“更改适配器设置”的窗口：

![网络与共享中心](/images/2010-08-28-net_cnt.png)

如果你发现一个：

![](/images/2010-08-28-MS_virtual_adapter.png)

那么恭喜你，你的设备被支持了！

这个的使用，有一个叫 Connectify 软件可以很方便地操作，大家可以到这里：[http://www.connectify.me/](http://www.connectify.me/)下载，教程也有了，我不再赘述。个人不喜欢装太多软件，Windows 命令行都能够解决的我就没装软件了，写个脚本就 OK 了。下面是相关命令行的办法，过程我省了，直接说怎么用。

打开记事本（不知道怎么打开？传送门：开始键[键盘上那个 旗子 的键]+R，输入 notepad，确定），将以下内容保存为一个后缀为 bat 的文件，文件名随意。

```bat
netsh wlan set hostednetwork mode=allow ssid=YOUR_SSID key=YOUR_PASSWORD
netsh wlan start hostednetwork
```

注意哦，将 `YOUR_SSID` 改成你喜欢的网络名字，`YOUR_PASSWORD` 改成你自己喜欢的密码（两个都用英文且不要包含空格和其他特殊符号，密码长度大于 8 位）。然后，保存，如图：

![](/images/2010-08-28-MS_virtual_adapter_config.png)

最后，保存的文件是这个样子就没错了：

![](/images/2010-08-28-MS_virtual_adapter_config_bat.png)

我们在这个文件上面点右键，选择以“管理员身份运行”：

![](/images/2010-08-28-MS_virtual_adapter_config_run.png)

弹出的黑色框程序运行完就自动退出了，然后这个时候，虚拟无线网已经建好了，你可以把它当作一张实实在在的网卡，并且别人也马上可以连接上了。

![](/images/2010-08-28-MS_virtual_adapter_connect.png)

同样的，点击链接，输入密码即可。当然啦，你也必须把有线网络的共享设置为共享到这个虚拟网卡上：

![](/images/2010-08-28-MS_virtual_adapter_reset.png)

用这个办法分享，即使你接入互联网也是通过无线网络的，例如中国电信的 Wlan 接入，也可以共享出去给你的朋友哦~一张网卡两个用，多好~

### 手动配置网络地址

前面我们一直使用自动配置 IP 地址（计算机进行网络通信是需要一个地址才行，我们叫 IP 地址） 的办法，但是有时由于自动配置的局限性，有些时候并不一定能够配置好，我们可以选择手动配置网络地址，这里就 IPv4 简单说一下。

要使两台电脑能够连接到一起，我们需要将两台电脑设置再同一个子网里面。

首先，我们需要打开配置页面：

我们打开“更改适配器设置”的窗口：

![网络与共享中心](/images/2010-08-28-net_cnt.png)

在你共享出去的网络连接上点击有右键（例如我现在是有线网络连接互联网，共享无线网络，我就点无线网络连接上面的），选择属性：

![](/images/2010-08-28-config_ip_1.png)

选择“Internet 协议版本 4(TCP/IPv4)”项目，点属性：

![](/images/2010-08-28-config_ip_2.png)

我们可以随意配置一个局域网的 IP 段，但是一般习惯使用 192.168.x.x 的地址，子网掩码使用 255.255.255.0 这样的地址，每一个数字可以是 1~254 之间的值，例如：

![](/images/2010-08-28-config_ip_3.png)

如果大家想了解子网掩码是如何划分子网的，可以参考[维基百科](http://zh.wikipedia.org/zh-cn/子网掩码)，我这里不细说，仅仅就使用说一下。

然后全部确定就可以了。

对于要连接进来的电脑，我们同样要这么配置，但是要多设置两项：默认网关和 DNS 服务器，例如设置成这样：

![](/images/2010-08-28-config_ip_4.png)

但是，要注意哦，这两次设置是有关系的，如果共享的和连接的设置无法对应上，就不能连接在一起的哦。这里就子网掩码为“255.255.255.0”时，讲两个例子：

> 如果共享的机器 IP 是 192.168.22.103，那么要连接的机器的 IP 地址可以是 192.168.22.1~192.168.22.254 之间除了 192.168.22.103 的所有 IP 都可以，但默认网关只能是 192.168.22.103；
>
> 如果共享的机器 IP 是 192.168.200.3，那么要连接的机器的 IP 地址可以是 192.168.200.1~192.168.200.254 之间除了 192.168.200.3 的所有 IP 都可以，但默认网关只能是 192.168.200.3。

很明显，我们只能有 253 个地址可以用，也就是这个子网最多容纳 253 台机器，如果我们不够用怎么办（这个真的有点……），那么就请你去研究子网掩码的事情了，比如 255.255.252.0 之类的掩码了~这里就不讨论。

DNS（域名解析系统，例如你要打开www.google.com，DNS会告诉你www.google.com的IP地址，供你的机器识别然后访问），其实你是可以设置为和网关一样的地址的，但是似乎有点不稳定，可能不出现网页要第二次刷新才能打开的情况，主要是由于，我猜充当网关的机器DNS要缓存的缘故吧。我这里截图设置的是一个Google提供的DNS服务，当然，你也可以选择其他的DNS地址，例如：

> Google Public DNS (8.8.8.8, 8.8.4.4)
> Norton DNS (198.153.192.1, 198.153.194.1)
> OpenDNS (208.67.222.222, 208.67.220.220)
> OpenDNS Family (208.67.222.123, 208.67.220.123)
> Comodo Secure DNS (156.154.70.22, 156.156.71.22)
> ScrubIt DNS (67.138.54.100, 207.225.209.66)
> DNS Advantage (156.154.70.1, 156.154.71.1)

也可以是你所在 ISP（互联网接入提供商，例如中国电信）提供的 DNS。

PS:今天发现，瑞星除了受贿之外，原来还会阻断 NAT 的，导致无法共享。

## 本节完，后续文章敬请期待……

如果有疑问，请留言告诉我吧。

（注：这么多年了，并没有写第二篇 @20170607）
