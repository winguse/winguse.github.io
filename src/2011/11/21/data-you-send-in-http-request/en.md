---
title: "From a Developer's Perspective, What Do You Submit When You Open a Web Page"
date: 2011-11-21 09:36:15 +0000
---

It's been a long time since I wrote anything. Over the past two days I looked through some old notes, remembered this topic, and decided to write a bit about it.

I'm someone who cares quite a lot about network interactions. On the web pages I make, I usually insert some analytics plugins to analyze traffic and observe our visitors.

When you open a browser and visit a website (URL), what information are you actually submitting? On the surface, most people know that you tell the website which URL you want to visit (request). In fact, there is a lot more data involved.

First of all, for the server, it needs to know which domain you are visiting. When you access the network, you usually do not find the server by IP address directly. The address you enter first contains a domain name, such as `www.google.com` or `www.renren.com`. These addresses are only there to make them easier for humans to remember. The browser first uses DNS to translate them into IP addresses that our computer networks can actually communicate with. For example, Google's URL might be: `74.125.71.105`. For the server, the IP address is like its street number. You may reach a certain street number through the address `www.google.com`, but it still needs to know which request you came for, because on the Internet the relationship between domain names and IP addresses is many-to-many: one IP address may be bound to multiple domain names, and one domain name may also correspond to multiple IPs. Usually this part is handled by the server's Web container (I like to call IIS, Apache, and the like Web containers). The former exists to make the best use of IP address resources, because some sites do not get much traffic, and if each such small site had to occupy one IP address—or even one server—that would obviously be wasteful. As for the latter, for some large sites, a single server cannot withstand traffic from all over the world, so we need to spread the traffic across mirror servers. In some cases, in order to let users get a better and faster server, DNS may even do geo-based resolution so users can access a nearby mirror server or route through a CDN.

After the server figures out why you came, it then needs the page you requested. For example, if you didn't specify any subpage and just want to visit a bare URL like `http://www.google.com`, the server will find the corresponding default document and return it to you. Server settings usually include things like index.html, index.php, default.html, and so on.

After the server processes the corresponding request, it sends the content back to you. Here, when you arrived, the server had already recorded your IP address, and then it sends the content back to you according to that IP. Of course, because HTTP runs over TCP, if the server doesn't know your address, there is naturally no way for it to communicate with you.

What I described above is basic Web request information. Anyone with basic web browsing knowledge should be familiar with it. In fact, there is still a lot of content being transmitted that you usually don't notice.

Let's look at a screenshot of visiting Google.com.hk. This is from Chrome's developer tools, and most browsers based on WebKit have this feature:

![](/images/2011-11-21-visit_google_hk1.png)

What we can see in the Request Header is all content submitted by your browser when you visit:

```
Accept:
text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Charset:
UTF-8,*;q=0.5
Accept-Encoding:
gzip,deflate,sdch
Accept-Language:
zh-CN,zh;q=0.8
Cache-Control:
max-age=0
Connection:
keep-alive
Cookie:
PREF=ID=4e3782148fd30563:FF=2:LD=zh-CN:NW=1:TM=1321862176:LM=1321862176:S=FplLGQfpngFf0x4Q; NID=53=nLr7reGCvomHUaOG4zJXaD-JwhBq4xYYsJcLK55B_EaRYvHeL9rk2Dy0OG8t_qxy-oPDIvSdlo6xCSkhzeeqnG-ZZUzLeOGwpsJW7EimXLqF2UDnBokEL5VnqrdfJLuT
Host:
www.google.com.hk
User-Agent:
Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.121 Safari/535.2
```

Among these, the one we just mentioned is Host, meaning the host name, that is, the domain name. But besides that, as you can see, there is a lot more.

The earlier Accept items describe what content your browser wants to accept—for example, I want to view HTML, XHTML is also fine, and so on; the character encoding I accept is UTF-8 (this is Unicode, sometimes translated into Chinese as the universal character set; simply put, it basically includes the character encodings of various countries, though some browsers may also send requests that include GB2312); next is the content encoding our browser accepts. We know HTML is text, so it can usually be compressed, which saves bandwidth; gzip is one such compression format. Then there is the accepted language. Mine here is Simplified Chinese, which is why when you visit some international sites you may see a different language from your friends abroad. In fact, your browser has already quietly told the server here that your preferred language is Chinese (this is related to your system settings; if you change the language, this will also change. Of course, the browser itself can also modify this since it is one of the browser's own properties).

The Cache item describes how your browser handles caching. A value greater than 0 means the browser will delete the cached content after the corresponding amount of time, in seconds. When it is less than or equal to 0, deletion of the cache is uncertain. When making a request, the browser first negotiates with the server to determine whether the file has been updated or whether the cached file still exists, and then decides whether to transfer the file.

The Connection property describes the connection types supported by the browser. At present, this basically only includes whether keep-alive is supported. Supporting it means the browser and server can establish a persistent connection, allowing multiple HTTP communications within a single TCP connection (within a certain amount of time) without creating a new TCP request. By default, this is enabled after HTTP/1.1.

The Cookie that follows is identity information set by the server for the user and used to identify the user. This is also why, after you log in to Renren once (if you choose to remember your login next time), you don't need to log in again for a while. So cookies are private things; otherwise your secrets would be leaked~ They contain your identity information, and on some websites that don't pay attention to information security, even your password might be stored there in plaintext! But don't get any ideas—what I'm showing here does not contain my identity information. I used private browsing when taking the screenshot and examples for everyone.

The last one is some other basic user information, called User-Agent, mainly browser information and system information. You can clearly see here that I'm using Chrome 15 on 64-bit Windows 7. Some people may question why I wrote Mozilla earlier—isn't that Firefox's company? Actually, that's for compatibility, because Mozilla/Netscape released web browsers first. Some old servers may not recognize your browser, so they wouldn't know how to serve pages to you. Then why do I say Windows 7 when it doesn't literally say Windows 7 above? Because it says NT 6.1, which is the kernel version number of Windows 7. Sometimes User-Agent also contains plugin information. For example, when you use IE, it might also submit your .NET version.

Finally, let's look at another screenshot:

![From a Developer's Perspective, What Do You Submit When You Open a Web Page](/images/2011-11-21-visit_google_hk_translate.png)

Here, I clicked on another page. Did you notice anything different in our Request?

Well, careful readers should have found that there is one more item:

> Referer:
> http://www.google.com.hk/

So what is this? If you take a bold guess, you should be able to guess that this is the page you visited previously. More precisely, it is the source page of this new URL, or, in other words, which page referred to this new URL. One thing worth mentioning is that referer is not sent between all pages. A page referenced from HTTPS cannot send it to an HTTP page. Referer statistics can also show users' browsing tendencies within a site, which can help optimize the site's structure and content.

What is the information you submit used for? Actually, the answer is obvious: the purpose is to allow the server to provide you with more targeted service, such as giving you your preferred language, or pages customized for your browser (for example, if you visit from a mobile phone, that would be a completely different User-Agent header). Or based on Referer, it can check which site linked to it, or even analyze referers coming from search engines to find out what problems visitors came to your site for. If the page is an error page, it can also use the referer to determine whether some link inside your site is wrong. It can also count the browser types of your visitors and make design adjustments accordingly. For example, IE6 is really awful—should we support that group of users? If that user base is still large, then Web programmers can only helplessly accept reality and do browser compatibility work. Things like that.

But is that all? Absolutely not. If you're attentive, you can mine a lot more data from this browsing information. Don't forget that when a visitor accesses a website, there is another important attribute: time. Combined with the IP address, we can even determine the visitor's geographic location. For places with static IP addresses, or places where IP address distribution is regular, sometimes we can pinpoint the IP location very precisely—even down to a dorm room number. The funniest examples I saw back then were comments showing addresses like a certain floor of a certain building at Tsinghua University. In fact, for some universities, these addresses really can be mapped very precisely; it mainly depends on how those addresses are collected. As for time, using some social engineering ideas, we can also roughly determine the visitor's identity. For example, students' schedules are different from those of other groups. For people you know well, their Internet usage habits can already narrow down the range. Then, combined with the corresponding User-Agent to determine their operating system and browser, it becomes even easier for niche users—for example, someone uniquely using a niche browser like Opera on a 64-bit system.

One more thing to add: in fact, the information mentioned above is sent for every web page element. Sometimes, for the convenience of statistics, we insert an image just to collect this information.

Actually, for website analytics, the above is still only one-sided. Websites may also embed analytics JavaScript, such as Google Analytic. Through JS, we can gather even more information, such as whether your browser supports Flash, Java, or other plugins; your screen resolution; the current browser window size; and so on. You can check Google Analytic for details. In some cases, even this is not enough. JS can even track where on the page you clicked (Renren collected this kind of data for users whose user ID modulo some number matched a condition, mainly as a reference for ad placement), where the mouse hovered, how long it stayed in a certain place (Google once collected this on search result pages), and what words were selected (technically this is possible, and it can be used to analyze what users are thinking about or interested in). In fact, user habits are a very obvious characteristic, and from a statistical point of view they are easy to reveal.

Does that sound a bit scary, that a single page visit leaks so much information...? In fact, this is already reality and part of the industrialization of the Web. If you really need to hide your browsing, you can choose private browsing, then choose a proxy server (preferably one without obvious characteristics), or even use software to remove your User-Agent and other identifying header information (sometimes language can also reveal your identity), disable JavaScript, and so on (though don't forget that disabling JavaScript also makes you look rather unusual).

Here's a privacy statement: for the statistical needs of my website, I also collect some information from visits to this page (of course, absolutely not to identify exactly who you are; it's mainly for statistics, and I won't analyze individual data points). The goal is simply to make what I write more popular with everyone.

Finally, I hope this article is helpful to those who like Web development, those who are about to build websites, or ordinary people who just like surfing the Internet.

If there are any mistakes or omissions, please feel free to point them out!
