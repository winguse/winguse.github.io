---
title: "Xiaomi 11 Pro Tinkering Notes"
date: 2021-06-14 23:00:00 +8000
---

> 10 years ago I was an Android ROM-flashing boy; 10 years later I am still that ROM-flashing boy.

That sentence is basically the best summary of my Dragon Boat Festival holiday.

A week before that holiday, I bought a Xiaomi 11 Pro. It was not really for replacing my phone; I mainly wanted to tinker and see how today's Android ecosystem had evolved. Also, having a device that can run Linux enables many experiments. With 618 discounts plus Beijing consumer coupons during a business trip, I got the 8+128GB model for under 3900 RMB.

Since I bought it for tinkering, root access was definitely the plan. But now you cannot root directly. Bootloader unlock has restrictions: you must bind the phone to your Xiaomi account, then wait 168 hours (7 days). See the [official guide](https://www.miui.com/unlock/index.html).

I was not in a hurry, so I first tried stock mainland MIUI. MIUI still has lots of features like in old days, but also lots of ads. This made my iPhone 12 mini feel even better. Android is still not very worry-free, though better than before. Domestic apps on both platforms are equally "involuted" with noise, recommendations, and visual clutter, but iOS is still somewhat more restrained. For Xiaomi specifically, I think it is still some distance from a true high-end experience: feature set is practical and sometimes surprising, but many details need polish. For example, white balance is inconsistent across the three cameras; by comparison, iOS tuning feels excellent. iOS software quality has declined in recent years, but it still leads MIUI by a noticeable margin. I also paid attention to Huawei HarmonyOS, and I feel Xiaomi may still need more R&D investment. Ads are another obstacle for Xiaomi's high-end path. In my experience, most ads can be turned off, but the switches are deeply hidden. Xiaomi's strategy is also awkward: if it wants internet-company valuation, it needs internet business, and ads seem to be one of the few monetization channels—but revenue contribution is limited, so it feels like a mixed blessing. I do not know how Xiaomi leadership sees it. I also do not know why: I installed Google Play, but still could not download apps. During debugging, I found it was probably not my network issue, but I also noticed the system makes requests to many strange domains. Privacy/security confidence was not great.

One week later, the three-day Dragon Boat holiday arrived, and I started the real tinkering. I will skip unlock details since official docs are enough. I first flashed the global build (which felt like a U.S.-oriented build), then noticed MIUI was not yet on 12.5 there, so I switched to the EU build. People said EU updates faster and has fewer ads with better privacy behavior. I will also skip full flashing details; one key point is downloading full ROM packages. There is also an [official guide](https://c.mi.com/oc/miuidownload/detail?guide=2). Unlock tools require Windows, but I verified flashing can also be done on macOS with minor script changes. Just do not re-lock the device accidentally.

Since I was already flashing, I also wanted root. The mainstream tool now is [Magisk](https://github.com/topjohnwu/Magisk). Note: the `.com` website shown by Google search is not owned by the author. The official source is the GitHub page. It may still download from GitHub, but using GitHub directly is safer. The [Magisk docs](https://topjohnwu.github.io/Magisk/install.html) already explain installation clearly, so I will not retranslate. One practical reminder: before installing Magisk modules, make sure `adb` is enabled and connect the phone once from your computer so trust is granted. This can save your phone when something breaks.

EU MIUI misses many practical features, such as:

- Transit card and access card
- Xiaomi app store
- "Flare"-style advanced permission controls

In theory these can be restored with Magisk. I tried hard and only restored transit/access cards plus Xiaomi app store; other features failed. I am not sure whether this is because EU build was `12.5.3` while mainland build was `12.5.4`, or for other reasons. Especially when I tried restoring advanced permission controls, the phone failed to boot, and even uninstalling modules through `adb` did not help.

There are many online posts on restoring transit/access cards. I tested them, and maybe because versions are newer, those steps did not work for me. In Xiaomi Wallet, tapping access card or transit card had no response, so I figured it out myself.

Most guides online target older Magisk module formats. New format is actually much simpler and needs fewer files. See the [documentation](https://topjohnwu.github.io/Magisk/guides.html). Briefly:

Create any folder and add `module.prop`, for example:

```
id=mi_smart_card
name=Xiaomi Smart Card
version=v0.0.1
versionCode=1
author=Yingyu
description=Add MIUI CN Features to 11 pro
```

From the corresponding mainland MIUI image, extract required apps from `/system/app/`. I do not care about UnionPay card features on my phone, so I did not restore those. For transit/access cards only, restoring `TSMClient` was enough. Important: `/system/app/TSMClient/lib/arm64` contains two symbolic links, and their target files must also be copied: `/system/lib64/libentryexpro.so` and `/system/lib64/libuptsmaddonmi.so`. Also, since some apps are not on Google Play, I restored Xiaomi App Store `MiuiSuperMarket` too.

For transit/access cards, system settings require setting NFC `Secure element position` to `Embedded secure element`. EU build does not expose this option, so you need to modify system props. Create `system.prop` at module root with:

```
ro.se.type=eSE,HCE,UICC
```

Zip the folder, copy it to phone, and install from local storage in Magisk.

After installation, this module only adds Xiaomi App Store icon on desktop. You still cannot directly see access/transit entries. You need shortcuts. I used [Shortcut Maker](https://play.google.com/store/apps/details?id=rk.android.app.shortcutmaker). After installing, create activity shortcuts for Xiaomi Smart Card app:

- Access card: `com.miui.tsmclient.ui.MifareCardListActivity`
- Transit card: `com.miui.tsmmclient.ui.introduction.CheckServiceActivity`
- Power-button double-click page: `com.miui.tsmclient.ui.quick.DoubleClickActivity`

Among these, the double-click page must be enabled first to register lock-screen double-click behavior. Other pages can then be used normally. For transit cards, you also need to sign in Xiaomi account in settings; to use more than two access cards, transit card binding is required.

I replaced all Xiaomi cloud services and disabled Find Device. But when I tried uninstalling that app with adb, the phone would not boot. Meanwhile the service kept running in background and pushing notifications. I had no good solution except disabling notifications. Worse, some notifications even pretended to be other apps (this appeared right after WeChat installation):

![Xiaomi Find Device notification appeared right after WeChat installation](/images/2021-06-14-xiaomi-find-device.jpeg)

No choice—just had to live with it.

## Notes for extract img

1. download and extra from [https://www.xiaomi.cn/post/25769526](https://www.xiaomi.cn/post/25769526)
2. `brew install simg2img` and `simg2img images/super.img out_super.img`
3. [http://newandroidbook.com/tools/imjtool.html](http://newandroidbook.com/tools/imjtool.html) `imjtool/imjtool out_super.img extract`
4. `ext4fuse extracted/system_a.img sysa -o allow_other`

[https://medium.com/@chmodxx/extracting-android-factory-images-on-macos-cc61e45139d1](https://medium.com/@chmodxx/extracting-android-factory-images-on-macos-cc61e45139d1)

also see: [https://blog.minamigo.moe/archives/184](https://blog.minamigo.moe/archives/184)
