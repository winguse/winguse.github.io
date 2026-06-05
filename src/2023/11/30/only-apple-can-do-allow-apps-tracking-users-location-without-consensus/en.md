---
title: "Apple allows applications to track user locations without authorization"
date: 2023-11-30 16:30:00 +0000
---

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
