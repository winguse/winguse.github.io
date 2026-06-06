---
title: "CMD命令帮助生成"
date: 2011-10-20 03:42:32 +0000
---

软件工程老师要我们熟悉 Shell 命令，要我们写一下那些开关什么的。

其实我不是很乐意，毕竟这些事情，就查查手册，好好用一下就好，写下来，太多了，也起不到多少学习作用。

我初中就开始写批处理，那些 CMD 命令那时候算是烂熟了。现在生疏了，磨叽了一下，用了 2 个多小时，凌晨，完成了这个：

```bat
@echo off
echo.处理中...
setlocal ENABLEDELAYEDEXPANSION ENABLEEXTENSIONS
set "OutFile=cmd_help.html"
call:HtmlBgn >%OutFile%
set "CmdName="
set "CmdDesc="
set /a CmdCnt=1
echo.^<div id="catalogue"^> >>%OutFile%
echo.^<p^>^<h1^>命令提示符帮助信息^</h1^>^</p^> >>%OutFile%
echo.^<p^>^<h2^>网络基础命令^</h2^>^</p^> >>%OutFile%
call:AddCmdList "ARP","物理地址缓存操作命令。" >>%OutFile%
call:AddCmdList "NET","Windows下的网络应用命令，包含用户创建、远程登录等功能。" >>%OutFile%
call:AddCmdList "NSLOOKUP","主机查询命令。" >>%OutFile%
call:AddCmdList "NETSH","非常强大的网络配置命令" >>%OutFile%
call:AddCmdList "PING","ping包发送命令，用于网络测试。" >>%OutFile%
call:AddCmdList "ROUTE","本机路由表命令，用于配置路由优先顺序。" >>%OutFile%
call:AddCmdList "TRACERT","数据包跟踪命令，用于路由线路检测。" >>%OutFile%
echo.^<p^>^<h2^>常用命令^</h2^>^</p^> >>%OutFile%
for /f "tokens=1,2* skip=1 delims= " %%i in ('help') do (
rem help有个命令换行后只有一个空格，就让我特殊处理，你让我情何以堪，我表示这个我不干。
  if "%%j%%k"=="" (
    if "%%i"=="" (
      goto ExitGetList
    ) else (
      set "CmdDesc=!CmdDesc!%%i"
      call:AddCmdList "!CmdName!" "!CmdDesc!" >>%OutFile%
      set "CmdName="
    )
  ) else (
    if "!CmdName!" NEQ "" (
      call:AddCmdList "!CmdName!" "!CmdDesc!" >>%OutFile%
    )
    set "CmdName=%%i"
    set "CmdDesc=%%j%%k"
  )
)
:ExitGetList
echo.^</div^> >>%OutFile%
echo.^<div id="main"^> >>%OutFile%
for /l %%i in (1,1,%CmdCnt%) do (
  call:WriteHelpItem "!CmdName_%%i!" "!CmdDesc_%%i!"  >>%OutFile%
)
echo.^</div^> >>%OutFile%
call:HtmlEnd >>%OutFile%
::cls
echo.处理完成，按任意键退出...
pause>nul

goto :eof

:AddCmdList
echo.^<a href="#%~1"^>%~1^</a^> ^<span^>%~2^</span^>^<br /^>
set "CmdName_!CmdCnt!=%~1"
set "CmdDesc_!CmdCnt!=%~2"
set /a CmdCnt=!CmdCnt!+1
goto :eof

:WriteHelpItem
if "%~1"=="" goto :eof
echo.^<p^>^<h2^>^<a^ href="#top" name="%~1"^>^</a^> %~1 %~2^</h2^>^</p^>
echo.^<p^>^<pre^>
%~1 /? 1>tmp1 2>tmp2
type tmp2 >>tmp1
for /f "tokens=1*" %%i in (tmp1) do (
  set "str=%%i %%j"
  set "str=!str:<=&lt;!"
  set "str=!str:>=&gt;!"
  echo.!str!
)
echo.^</pre^>^</p^>
del tmp1 tmp2
goto :eof

:HtmlBgn
echo.^<^^!doctype html^>
echo.^<html^>
echo.^<head^>
echo.^<title^>命令提示符帮助信息^</title^>
echo.^<style^>
echo.body{overflow-x:hidden;}
echo.#catalogue{top:0px;position:fixed;width:350px;overflow:auto; height:100%%;background:#F7F7F7;}
echo.#main{margin-left:370px;}
echo.^</style^>
echo.^</head^>
echo.^<body^>
goto :eof

:HtmlEnd
echo.^</body^>
echo.^</html^>
::goto :eof
```

其实，真正常用的也不是很多，我随便列出那些非常常用的吧：

网络：

```
ping
nslookup
tracert
```

普通：

```
cd
cls
copy
date
del
dir
echo
exit
fc
help
md
more
move
rd
ren
start
time
xcopy
```
