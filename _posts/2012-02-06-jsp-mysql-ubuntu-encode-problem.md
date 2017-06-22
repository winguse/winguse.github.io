---
layout: post
title: "JSP Mysql Ubuntu 乱码问题"
date: 2012-02-06 12:45:04 +0000
---

现象：

JSP连接MySQL出现中文乱码。修改request的Character无效，数据Schema和表已经是utf8了。PHP连接都没问题，就是JSP有问题。

原因：
连接的属性是拉丁文编码的。

解决办法：

`/etc/mysql/my.cnf`

```
[client]
default-character-set=utf8

[mysqld]
default-character-set=utf8
init_connect='SET NAMES utf8'
```
