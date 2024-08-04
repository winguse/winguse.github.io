---
title: "小米 11 Pro 折腾笔记"
date: 2021-06-14 23:00:00 +8000
---

> 10 年前我用安卓是个刷机 boy，10 年后我用安卓依然还是那个刷机 boy

这句话几乎就是我这个端午假期最好的总结。

再之前一周，我买了一部小米 11 Pro，其实也不是为了换手机，就是想折腾一下，看看当今安卓的生态都发展成什么样子了，另外，有一个可以跑 Linux 的设备，也可以玩很多别的花样，当然啦，毕竟 618 打折嘛，加上在北京出差，正好用上北京消费券，用不到 3900 的价钱就买到了这部 8 + 128GB 的机器了。

买回来既然是要折腾，肯定就是想 root 啦，不过现在不能直接 root，解锁是有限制的，需要先绑定手机到自己的小米账户，然后等 168 小时（7 天），具体可以参考[官方教程](https://www.miui.com/unlock/index.html)。

我也不着急，所以就先体验了一把原版的国产 MIUI。MIUI 还是如当年一般做了好多功能，不过也真的是有各种广告。表示越来越觉得手里的 iPhone 12 mini 真香，安卓的生态太不让人省心了，虽然感觉比以前已经好了不少，同样是国产 App，虽然都一样卷，花里胡哨各种推荐各种噪音，但是 iOS 还是要收敛一些的。就小米而言，我觉得目前体验离高端还有距离，功能确实很接地气，功能也让我惊讶，但很多细节有待打磨。比如说，三个摄像头的白平衡是不一致的，对比之下，iOS 这边简直是调教逆天。iOS 最近几年软件质量不行了，但是比 MIUI 还是要领先一两个身位的。最近也留意了一下华为的鸿蒙，我觉得吧，小米在研发上的投入可能真的还不够。广告的问题，也是其高端路线的一个坎。我体验下来，确实大多数广告都是可以关闭的，但是藏得都很深。小米的运营策略也很尴尬，想要互联网估值，就需要有互联网业务啊，这一块好像广告就是为数不多的变现方式了，但是其实贡献的营收也不是很多，我觉得很鸡肋，当然我不知道小米的大佬们怎么看吧。我也不知道为啥，我装了 Google Play，但是就是没办法下载软件。Debug 的过程中，我发现应该不是我网络的问题，但是也发现了这系统，平时请求的奇奇怪怪的域名也太多了吧。隐私安全上，还真的是很不让人放心啊。

一周以后，就是端午三天假期了，开始折腾。解锁过程有官方教程，按下不表。刷机最开始选择的是国际版（其实感觉就是美国版），但是后来发现 MIUI 还没更新到 12.5，所以又换成了欧洲版，据说欧洲版更新也更快一些，而且隐私上面也更收敛一些，没那么多广告。具体的刷机教程我也按下不表，值得提一点的就是需要下载完整的刷机包，也有[官方教程](https://c.mi.com/oc/miuidownload/detail?guide=2)。解锁的工具要用 Windows，刷机我实测也可以在 macOS 上搞定，需要稍微修改一下脚本。注意不要重新锁了机器就好了。

既然都刷机了，肯定还是要玩 root 的啦，现在流行的是使用面具（[Magisk](https://github.com/topjohnwu/Magisk)）这个工具，注意，Google 搜索出来那个 `.com` 的并非作者所有的网页，作者只有 Github 上的那个页面，不过好像下载的还是 Github 的，但是还是自己去 Github 比较保险。过程 [Magisk 上面的文档](https://topjohnwu.github.io/Magisk/install.html)也说的很清楚了，我就不翻译了。特别提醒一下，安装 Magisk 模块的时候，记得先把 `adb` 打开，而且要用电脑先连一次让手机信任了，折腾死了有时候可以救命。

欧洲版的 MIUI 其实少了很多实用的功能，比如：

- 公交卡、门禁卡
- 小米应用商店
- 照明弹等等高级权限控制

理论上是可以通过 Magisk 来恢复的，我为此也折腾了一番，不过结果我也就搞定了公交卡、门禁和小米应用商店，别的都没搞定。不清楚是不是因为目前欧洲版是 `12.5.3` ，大陆版是 `12.5.4` 的原因，还是别的。特别是我想装回权限控制的时候，直接就无法开机了，而且 `adb` 上去卸载掉模块也不行。

网上有好几篇写如何恢复公交卡和门禁卡的，我测试了一下，可能因为现在是新版本了，我按照上面的操作也并不能使用，打开小米钱包以后，点击门禁、公交卡没有反应，所以我自己折腾了一番。

网上介绍的，都是针对老版本的 Magisk 制作方法，新版的其实很简单的，不需要那么多文件。详细可以参考[文档](https://topjohnwu.github.io/Magisk/guides.html)，这里简单描述一下。

随便弄一个文件夹，新建一个文件 `module.prop` ，例如：

```
id=mi_smart_card
name=Xiaomi Smart Card
version=v0.0.1
versionCode=1
author=Yingyu
description=Add MIUI CN Features to 11 pro
```

找对应的大陆版 MIUI，提取 `/system/app/` 对应的 App，我对在我这个手机上使用银联卡并不感兴趣，所以我觉得我并不需要恢复银联卡的功能。试了一下，如果只是要公交卡和门禁，我只需要恢复 `TSMClient` 就可以了，值得注意的是，`/system/app/TSMClient/lib/arm64` 里头是两个符号连接，也要把他们对应的文件复制好，具体地就是 `/system/lib64` 的 `libentryexpro.so`和`libuptsmaddonmi.so`两个文件。当然，因为考虑到有些软件 Google Play 上没有，我还是恢复了小米应用商店 `MiuiSuperMarket`。

公交和门禁，需要将系统设置里头，NFC `安全模块设置`改成`内置安全模块`，然而，欧洲版并没有这个选项，恢复这个选项，需要修改系统的 prop。具体是，根目录新建`system.prop`，内容如下：

```
ro.se.type=eSE,HCE,UICC
```

将上述文件夹里的内容打一个`zip`包，下载到手机，在 Magisk 上`从本地安装`即可。

安装上以后，这个模块，桌面只会多一个小米应用商店。然而并不能看到门禁、公交卡的影子。我们需要给他们建一个快捷方式，这里用到 [Shortcut 这个 App](https://play.google.com/store/apps/details?id=rk.android.app.shortcutmaker)，下载后，在 Activity 里头，给小米智能卡这个 App 创建几个快捷方式即可，分别是：

- 门卡：`com.miui.tsmclient.ui.MifareCardListActivity`
- 公交卡：`com.miui.tsmmclient.ui.introduction.CheckServiceActivity`
- 双击电源界面：`com.miui.tsmclient.ui.quick.DoubleClickActivity`

其中，双击电源那个，只有打开了，才能注册上锁屏界面双击使用。其他界面可以照常使用即可。公交卡需要在系统设置里头登陆了小米账户，绑定了公交卡才能拥有两张以上门禁卡。

小米的云服务我都换掉了，查找手机的功能也关掉了，但是我尝试去用 adb 卸载这个应用，结果就无法开机了，但是这玩意不厌其烦地在后台活跃，还给我推送通知，我也没啥办法，只能把它通知关掉。。至于这通知，竟然冒充起别人了（微信安装好以后就出现这个通知）：

![微信安装好以后就出现小米查找手机通知](/images/2021-06-14-xiaomi-find-device.jpeg)

没办法，只能躺平。。

## Notes for extract img

1. download and extra from [https://www.xiaomi.cn/post/25769526](https://www.xiaomi.cn/post/25769526)
2. `brew install simg2img` and `simg2img images/super.img out_super.img`
3. [http://newandroidbook.com/tools/imjtool.html](http://newandroidbook.com/tools/imjtool.html) `imjtool/imjtool out_super.img extract`
4. `ext4fuse extracted/system_a.img sysa -o allow_other`

[https://medium.com/@chmodxx/extracting-android-factory-images-on-macos-cc61e45139d1](https://medium.com/@chmodxx/extracting-android-factory-images-on-macos-cc61e45139d1)

also see: [https://blog.minamigo.moe/archives/184](https://blog.minamigo.moe/archives/184)
