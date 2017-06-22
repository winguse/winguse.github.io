---
layout: post
title: "Patch Windows 7's Minesweeper to run on Windows 8.1"
date: 2013-12-30 02:54:38 +0000
---

Hex replace from

<pre>3b c7 0f 4c cf 3b ce 0f 94 c1 40 3a cf 75 07 8b</pre>

to

<pre>39 c0 0f 4c cf 3b ce 0f 94 c1 40 3a cf 75 07 8b</pre>.

A lot of posts talking about replacing the binary <pre>7D 04 83 65 FC 00 33 C0 83 7D FC 01 0F 94 C0</pre>, but it does not work.
