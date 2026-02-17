---
title: "Things About Network Sharing (1) — Shared Internet Access"
date: 2010-08-28 13:43:04 +0000
---

## Preface

A brand-new blog, and I really didn't have much to write. Then I thought network sharing is actually a pretty nice topic, so why not write about it~

Let me make this a series. I plan to write several connected posts. Since I'm just a beginner too, I'll try to explain everything in the most straightforward language possible. Of course, my knowledge is limited, so experts from all sides are welcome to point out any mistakes~

Networks exist to connect people, so sharing, in my opinion, is at the core of networking. Especially with the rise of Web 2.0, individual contributions to the network are emphasized even more. We can share what happens in our lives, share our opinions, publish our thoughts, and so on... Likewise, as readers, we can also obtain information through the internet to improve our lives and increase our productivity.

For the first post, let me share some thoughts on internet sharing.

## Preparation

This article discusses only the Windows platform. The steps should work for operating systems newer than Windows XP. As for screenshots, I'll use my Windows 7 setup as the example.

On the hardware side, you need at least two network adapters (later I will also mention how to configure things when you have only one adapter—we'll go from simple to more advanced~).

## Detailed Steps

### Enable Sharing

![Open Network and Sharing Center](/images/2010-08-28-open_network_config_1.png)

In the notification area at the right end of the taskbar, find the network icon (if you are not connected to Wi-Fi, it may look like this: ![Network icon](/images/2010-08-28-net_ico.png). Of course, the icon changes depending on network status. If you really can't find it, just click the icons one by one—you'll eventually find the situation shown above), click it, and then click “Open Network and Sharing Center.” For XP users, you can right-click “My Network Places” on the desktop and choose “Properties.” Vista users are similar to Windows 7—just find “Network and Sharing Center.” I won't include screenshots for those here.

![](/images/2010-08-28-open_network_config_2.png)

On the right side of the window, click “Change adapter settings.”

![Network and Sharing Center](/images/2010-08-28-net_cnt.png)

At this point, you will see an interface similar to the one above. Depending on which network adapter you are currently using to access the internet (for example, if you are using a wired network [campus network, residential network, etc.], choose “Local Area Connection”; if you are using an ADSL dial-up connection, choose something like “Broadband Connection”), right-click that adapter and choose Properties.

![Right-click the connection used for internet access](/images/2010-08-28-right_click_on_lan.png)

I'm using a campus network here, so it is “Local Area Connection.”

![Sharing tab](/images/2010-08-28-share_page.png)

In the properties window that pops up, switch to the “Sharing” tab, and you will see the interface above.

![](/images/2010-08-28-share_set.png)

In the drop-down menu for selecting a private network connection, if you have three or more network adapters, you will see the same situation as I do. Just choose the adapter through which you want to share the network. If not, simply check the two checkboxes above. The final result should look like this:

![](/images/2010-08-28-share_set_1.png)

Then click OK, and a prompt will appear:

![](/images/2010-08-28-share_set_2.png)

You will see that the system tells you it has already set the address of the adapter you want to share out as "192.168.2.1" (you may see a different address; this one is from my computer). If other computers want to access the internet through your computer, they only need to connect to the adapter you are sharing. So here we can simply click “Yes.”

So how do we connect someone else's computer to yours using the adapter you are sharing?

### Link Connection

If what you are sharing is a wired network adapter and you only need to share with one person, in general a single network cable connecting the two adapters will do the job. If not, it may be a compatibility issue with the network cards. Because the cables we normally use are twisted-pair cables, if a network card supports only one wiring symmetry, direct connection with an ordinary cable may fail. You can solve this by using a crossover cable, or by using the method for multiple computers. If more computers need to share the connection, just connect your computer and theirs together through a switch, router, or similar network device. You can easily find such equipment at a normal computer accessories store.

If what you are sharing is a wireless network adapter, there are three possible solutions:

1. Create a temporary peer-to-peer wireless network
2. Use a wireless router
3. If the adapter is supported by the Windows 7 virtual adapter feature, use a virtual adapter to create a wireless hotspot (it acts like a router and does not affect the physical adapter's own internet access)

Below, I will describe the first and third wireless methods in detail. As for wireless routers, settings vary greatly from model to model, so please refer to the manual.

#### Create a Temporary Peer-to-Peer Wireless Network

Just like before, open “Network and Sharing Center,” and then let the screenshots do the talking:

![](/images/2010-08-28-establish_temp_wifi_1.png)

![](/images/2010-08-28-establish_temp_wifi_2.png)

![](/images/2010-08-28-establish_temp_wifi_3.png)

![](/images/2010-08-28-establish_temp_wifi_4.png)

![](/images/2010-08-28-establish_temp_wifi_5.png)

![](/images/2010-08-28-establish_temp_wifi_6.png)

![](/images/2010-08-28-establish_temp_wifi_7.png)

At this point, the machine that will share the connection has been set up. Then, on the machine that wants to connect, open the small network connection dialog in the same way, like this:

![](/images/2010-08-28-connect_to_temp_wifi_1.png)

You can see the wireless network that was just created. Select it and click Connect.

![](/images/2010-08-28-connect_to_temp_wifi_2.png)

A password is required. Enter it and confirm. Since earlier we used the default IP address settings, once connected, the default settings (automatically obtain a network address) should be enough. If it still doesn't work, refer to the last section of this article and configure the network address manually.

### Set Up a Wireless Hotspot Using a Virtual Adapter

This method requires quite a bit of luck. First, you must be using Windows 7, and second, your network adapter must support it. How can you tell whether your adapter is supported? Earlier, we opened the “Change adapter settings” window:

![Network and Sharing Center](/images/2010-08-28-net_cnt.png)

If you discover one of these:

![](/images/2010-08-28-MS_virtual_adapter.png)

Then congratulations—your device is supported!

There is a piece of software called Connectify that makes this very easy to operate. You can download it here: [http://www.connectify.me/](http://www.connectify.me/), and it also has tutorials, so I won't repeat them. Personally I don't like installing too much software. If Windows command line can handle it, I won't install extra software; a script is enough. Below is the command-line approach. I'll skip the process and go straight to how to use it.

Open Notepad (don't know how? Shortcut: Start key [the one with the flag on the keyboard] + R, type `notepad`, and click OK), save the following content as a file with a `.bat` extension. The filename can be anything.

```bat
netsh wlan set hostednetwork mode=allow ssid=YOUR_SSID key=YOUR_PASSWORD
netsh wlan start hostednetwork
```

Note: replace `YOUR_SSID` with the network name you like, and `YOUR_PASSWORD` with a password you like (use English letters/numbers only, do not include spaces or other special symbols, and make the password longer than 8 characters). Then save it, as shown below:

![](/images/2010-08-28-MS_virtual_adapter_config.png)

Finally, if the saved file looks like this, then it's correct:

![](/images/2010-08-28-MS_virtual_adapter_config_bat.png)

Right-click this file and choose “Run as administrator”:

![](/images/2010-08-28-MS_virtual_adapter_config_run.png)

The black console window will close automatically after running. At that point, the virtual wireless network has been created. You can treat it as a real network adapter, and other people can connect to it immediately.

![](/images/2010-08-28-MS_virtual_adapter_connect.png)

Likewise, just click Connect and enter the password. Of course, you must also set your wired internet connection to share to this virtual adapter:

![](/images/2010-08-28-MS_virtual_adapter_reset.png)

With this method, even if your own internet access is also through wireless networking—for example, China Telecom's WLAN access—you can still share it with your friends~ One network card doing two jobs, pretty nice~

### Configure Network Addresses Manually

Earlier, we kept using the method of automatically configuring IP addresses (a computer needs an address to communicate on a network; we call that an IP address). But sometimes automatic configuration has limitations and may not work properly, so we can choose to configure network addresses manually. Here I will briefly talk only about IPv4.

To allow two computers to connect to each other, we need to place them in the same subnet.

First, we need to open the configuration page:

Open the “Change adapter settings” window:

![Network and Sharing Center](/images/2010-08-28-net_cnt.png)

Right-click the network connection you are sharing out (for example, if I am using a wired network to access the internet and sharing it through wireless networking, then I would right-click the wireless network connection) and choose Properties:

![](/images/2010-08-28-config_ip_1.png)

Select the “Internet Protocol Version 4 (TCP/IPv4)” item and click Properties:

![](/images/2010-08-28-config_ip_2.png)

We can freely choose a LAN IP range, but in general people are used to using addresses in the 192.168.x.x range, with a subnet mask such as 255.255.255.0. Each number can be a value between 1 and 254. For example:

![](/images/2010-08-28-config_ip_3.png)

If you want to understand how subnet masks divide subnets, you can refer to [Wikipedia](http://zh.wikipedia.org/zh-cn/子网掩码). I won't go into detail here; I'm only talking about practical use.

Then just click OK all the way through.

For the computer that wants to connect in, you need to configure it in the same way, but set two more items: the default gateway and the DNS server. For example, set it like this:

![](/images/2010-08-28-config_ip_4.png)

But note that these two configurations are related. If the sharing side and the connecting side do not correspond correctly, they cannot connect to each other. Here are two examples using the subnet mask “255.255.255.0”:

> If the sharing machine's IP is 192.168.22.103, then the connecting machine's IP can be any address from 192.168.22.1 to 192.168.22.254 except 192.168.22.103 itself, but the default gateway can only be 192.168.22.103;
>
> If the sharing machine's IP is 192.168.200.3, then the connecting machine's IP can be any address from 192.168.200.1 to 192.168.200.254 except 192.168.200.3 itself, but the default gateway can only be 192.168.200.3.

Obviously, that gives us only 253 usable addresses, meaning this subnet can hold at most 253 machines. If that's not enough (which is really a bit much...), then you'll need to study subnet masks more deeply, such as masks like 255.255.252.0~ I won't discuss that here.

DNS (Domain Name System—for example, when you want to open www.google.com, DNS tells you the IP address of www.google.com so your machine can recognize it and visit it) can actually be set to the same address as the gateway, but that seems a bit unstable. Sometimes a web page may fail to open until you refresh a second time. I guess that is mainly because the machine acting as the gateway needs to cache DNS data. In my screenshot I used a DNS service provided by Google. Of course, you can also choose other DNS addresses, such as:

> Google Public DNS (8.8.8.8, 8.8.4.4)
> Norton DNS (198.153.192.1, 198.153.194.1)
> OpenDNS (208.67.222.222, 208.67.220.220)
> OpenDNS Family (208.67.222.123, 208.67.220.123)
> Comodo Secure DNS (156.154.70.22, 156.156.71.22)
> ScrubIt DNS (67.138.54.100, 207.225.209.66)
> DNS Advantage (156.154.70.1, 156.154.71.1)

It can also be the DNS provided by your ISP (internet access provider, for example China Telecom).

PS: Today I discovered that Rising not only takes bribes, it also blocks NAT, which makes sharing impossible.

## End of This Section, Stay Tuned for the Following Articles...

If you have any questions, please leave me a message.

(Note: After all these years, I still never wrote the second article @20170607)
