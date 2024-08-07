---
title: "Apple allows applications to track user locations without authorization"
date: 2023-11-30 16:30:00 +0000
---

> 中文在英文文末

Apple asserts itself as a champion of user privacy; however, this claim will be proven untrue in this article.
For almost a decade, Apple allowed apps had the capability to track users' locations without affording them the option to disable this feature or even raising awareness about it.
And this is "ONLY APPLE CAN DO"!

## The HotspotHelper API in Action

Since the introduction of iOS 9 in 2015, Apple has included an API call named "HotspotHelper," enabling developers to request a capability for their apps to assist the system in connecting to WiFi access points.
Let's delve into how this API works with a simplified code snippet:

```swift
import CoreLocation
import NetworkExtension

class LocationTrackingManager {
    func setupHotspotHelper() {
        // Request HotspotHelper capability
        NEHotspotHelper.register(options: nil, queue: DispatchQueue.main) { (command) in
            if let networkList = command.networkList {
                for network in networkList {
                    // Access WiFi network information (SSID, MAC address)
                    // see: https://developer.apple.com/documentation/networkextension/nehotspotnetwork
                    let ssid = network.ssid
                    let macAddress = network.bssid

                    // Perform location tracking logic with ssid and macAddress
                    self.trackLocation(withSSID: ssid, andMACAddress: macAddress)
                }
            }
        }
    }

    func trackLocation(withSSID ssid: String, andMACAddress macAddress: String) {
        // Your location tracking logic goes here
        // Use the ssid and macAddress to determine user location
    }
}
```

This snippet demonstrates how developers can utilize the HotspotHelper API to register for WiFi network information.
The trackLocation method showcases the potential for extracting data that can be used for location tracking.

## The Privacy Dilemma

The real cause for concern arises from the fact that, with access to such information, apps can effectively track a user's location.
This is based on the premise that most WiFi access points remain stationary after deployment, providing a consistent reference for triangulating a user's whereabouts.
Public API avalible such as [Precisely Location By Wi-fi Access Point](https://developer.precisely.com/apis/geolocation),
[Google's Geolocation API](https://developers.google.com/maps/documentation/geolocation/requests-geolocation).
While the intentions behind HotspotHelper may be rooted in facilitating seamless connectivity, the unintended consequence of potential location tracking without explicit user consent raises eyebrows in the ongoing privacy debate.

This capability is activated whenever the user's device scans nearby WiFi access points, extending beyond explicit user engagement with the system settings to include instances where the device is locked in someone's pocket.
The system will initiate the registered app with this API, enabling the app to retrieve nearby SSIDs and their MAC addresses and transmit this information to the server side.
Consequently, if the app developer wishes, they possess the capability to nearly real-time track the user's location.
Importantly, users remain unaware of this process occurring on their screens, and they lack the option to disable it.
On the other hand, almost all the users doesn't know the App has this feature and they don't need/use this feature to help their lives.
But again, they have no choice, their devices has to launch the App and submit near by WiFi info to the developers of the App.

## Global Impact: WeChat and Alipay

Adding another layer to the discussion is the fact that major apps like WeChat and Alipay have already implemented this capability.
These two apps are ubiquitous in mainland China, touching almost every aspect of people's lives.
The widespread use of these applications in a densely populated region intensifies the implications of location tracking without user consent.

A compelling debate could center around whether WeChat and/or Alipay function as responsible citizens in the app world,
asserting that their data collection aims solely at enhancing user experience and facilitating seamless connections to nearby WiFi.
Nevertheless, the opaque server-side logic embedded in their code raises questions.
Could it be that once again, "ONLY APPLE CAN DO" in terms of ensuring transparency and accountability?

## Apple's "response"

In reality, I discovered this issue approximately two years ago and created a [video](https://www.bilibili.com/video/BV16Z4y1Q7fN/) on Bilibili (a Chinese alternative to YouTube) discussing the matter.
However, it has only very limited public awareness. I also brought this concern to Apple's attention and received an email response, but as of now, there has been no further update on the matter.

![Apple email response regarding HotspotHelper](/images/apple-response-to-hotspot-helper.jpg)

## Conclusions

I strongly advocate for Apple to offer users the option to disable this feature, akin to other privacy settings such as location and notifications.
Apps should explicitly seek permission before accessing this feature, ensuring users have the ability to grant or deny access while using the app.

As the conversation around digital privacy continues to evolve, Apple finds itself navigating the fine line between innovation and safeguarding user data.
The question remains: can Apple maintain its commitment to privacy while addressing concerns raised by the HotspotHelper feature?
Only time will tell how this controversial aspect fits into Apple's broader privacy narrative.

> Credit: This article was written with the assistance of ChatGPT for the purpose of refining my English writing.

---

苹果公司自诩为用户隐私的捍卫者，然而这并非事实。
在近十年的时间里，苹果允许应用程序具备跟踪用户位置的能力，而不提供关闭此功能或引起用户对此的关注的选项。
而且这是「只有苹果可以做到的」（Only Apple Can Do）！

## HotspotHelper API 的示例代码

自 2015 年 iOS 9 推出以来，苹果已经包含了一个名为「HotspotHelper」的 API 调用，使开发人员能够请求其应用程序协助系统连接到 WiFi 接入点的能力。
让我们深入了解这个 API 是如何与一个简化的代码片段一起工作的：

```swift
import CoreLocation
import NetworkExtension

class LocationTrackingManager {
    func setupHotspotHelper() {
        // 请求 HotspotHelper 能力
        NEHotspotHelper.register(options: nil, queue: DispatchQueue.main) { (command) in
            if let networkList = command.networkList {
                for network in networkList {
                    // 访问 WiFi 网络信息（SSID、MAC 地址）
                    // 参见：https://developer.apple.com/documentation/networkextension/nehotspotnetwork
                    let ssid = network.ssid
                    let macAddress = network.bssid

                    // 使用 ssid 和 macAddress 执行位置跟踪逻辑
                    self.trackLocation(withSSID: ssid, andMACAddress: macAddress)
                }
            }
        }
    }

    func trackLocation(withSSID ssid: String, andMACAddress macAddress: String) {
        // 你的位置跟踪逻辑在这里
        // 使用 ssid 和 macAddress 确定用户位置
    }
}
```

这个片段演示了开发人员如何利用 HotspotHelper API 注册 WiFi 网络信息。
`trackLocation` 方法展示了提取可用于位置跟踪的数据的潜力。

## 隐私困境

真正引起关注的原因在于，有了这样的信息访问权限，应用程序可以有效地跟踪用户的位置。
这是基于这样一个前提，即大多数 WiFi 接入点在部署后保持不动，为三角定位用户位置提供了一个一致的参考。
公开的 API 包括 [Precisely 的 Wi-fi 接入点的准确位置](https://developer.precisely.com/apis/geolocation)，
[Google 的 Geolocation API](https://developers.google.com/maps/documentation/geolocation/requests-geolocation)。
尽管 HotspotHelper 的初衷可能是促进无缝连接，但潜在的未经用户明示同意的位置跟踪的意外后果应在持续的隐私辩论中引起关注。

这一功能在用户设备扫描附近 WiFi 接入点时激活，超出了用户明确与系统设置互动的情况，还包括设备被锁在口袋里的情况。
系统将使用此 API 启动注册的应用程序，使应用程序检索附近的 SSID 和它们的 MAC 地址，并将此信息传输到服务器端。
因此，如果应用程序开发人员希望，他们就可以几乎实时跟踪用户的位置。
重要的是，用户对其屏幕上发生的此过程毫不知情，并且他们无法禁用它。
另一方面，几乎所有用户都不知道应用程序具有此功能，他们不需要/使用此功能来帮助他们的生活。
但再次，他们别无选择，他们的设备必须启动应用程序并将附近的 WiFi 信息提交给应用程序的开发人员。

## 世界范围的影响：微信和支付宝

讨论的另一个层面是微信和支付宝等主要应用已经实施了这一功能。
这两个应用在中国大陆无处不在，几乎触及人们生活的方方面面。
这些应用在人口密集地区的广泛使用加剧了未经用户同意的位置跟踪的影响。

一个可能有力的抗辩可能会说，微信和/或支付宝是在应用程序世界中有责任感的公民，他们的数据收集目的仅在于增强用户体验和促进与附近 WiFi 的无缝连接。
然而，我们无法审查他们服务器端的代码，我们无从得知从我们设备发送出去的数据他们会怎么处理。
难道再次可以说，「只有苹果可以做到的」（Only Apple Can Do）确保他们的透明度和付责任吗？

## 苹果的「回应」

实际上，我大约两年前发现了这个问题，并在哔哩哔哩上创建了一个 [视频](https://www.bilibili.com/video/BV16Z4y1Q7fN/) 来讨论这个问题。
然而，它的公众认知非常有限。我还把这个问题带给了苹果的注意，并收到了一封电子邮件回复，但截至目前，对此事并没有进一步的更新。

![苹果关于 HotspotHelper 的电子邮件回应](/images/apple-response-to-hotspot-helper.jpg)

## 小结

我强烈主张苹果向用户提供禁用此功能的选项，类似于其他隐私设置，如位置和通知。
应用程序在访问此功能之前应明确请求权限，确保用户在使用应用程序时具有授予或拒绝访问的能力。

随着数字隐私讨论的不断发展，苹果会发现自己在创新和保护用户数据之间的窄缝中航行。
问题仍然是：苹果是否希望在解决 HotspotHelper 功能引起的担忧的，保持对隐私的承诺？
只有时间能告诉我们这种致用户隐私不顾的行为，会如何融入到苹果宏大的隐私叙事中。

> 致谢：本文是在 ChatGPT 的协助下写成，目的是完善我的英语写作。
