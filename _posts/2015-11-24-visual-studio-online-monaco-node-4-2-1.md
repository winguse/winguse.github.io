---
layout: post
title: "在 Visual Studio Online 'Monaco' 中使用 node 4.2.1"
date: 2015-11-24 08:13:27 +0000
---

如果你使用 Azure Website App 中的 “在Visual Studio Online中编辑” 这个预览功能，你会发现默认的命令行中的 Node 是0.1.x那个很老的版本，一些命令可能会出错。简单的解决方案是，自己写一个脚本，例如这样的：

```bat
REM set PATH to fix the issues of node/npm version in visual studio online (monaco)
SET "PATH=D:\Program Files (x86)\nodejs\4.2.1\;D:\Program Files (x86)\npm\3.3.9\;%PATH%"
npm %*
```

保存为 `npm.bat`，然后每次npm的命令都换成这个bat就可以了。

这个原因是，scm 这个site也是用node写的，它依赖 0.1.x 这个版本。而创建的命令行是它的子进程，所以继承了它node的版本。但是你正常跑的程序还是4.1.2的。具体你可以参见：https://YOUR_WEB_SITE.scm.azurewebsites.net/ProcessExplorer/，看一下进程树以及他们的环境变量，基本上一目了然。
