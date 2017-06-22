---
layout: post
title: "SSL issues of 'no transparency information was supplied from server' in Windows Server"
date: 2015-12-01 15:49:54 +0000
---

Nowadays, the Internet is going to deprecate sha1 signature for SSL certificates. Although the newly issued certificate were signed by sha256 or above, but some old sha1 intermediate CAs still cached in various ways. I installed a new certificate issued by startssl.com recently, and Chrome said the signing path has one sha1 certificate, and it's insecure.

After looking into certificate manger of local computer (run mmc -&gt; file -&gt; add/remove snap-in... -&gt; certificates -&gt; local computer), I found that I have two intermediate CA from startssl, see as below:

![two intermediate certificates from startssl](/images/2015-12-01-two_intermediate_certificates_from_startssl.png)

So, the action we need to take is to delete the old one which signed with sha1. A restart may required to make it take effect.
