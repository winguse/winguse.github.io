---
title: "CMD命令帮助生成"
date: 2011-10-20 03:42:32 +0000
---

软件工程老师要我们熟悉 Shell 命令，要我们写一下那些开关什么的。

其实我不是很乐意，毕竟这些事情，就查查手册，好好用一下就好，写下来，太多了，也起不到多少学习作用。

我初中就开始写批处理，那些 CMD 命令那时候算是烂熟了。现在生疏了，磨叽了一下，用了 2 个多小时，凌晨，完成了这个：

```bat
@echo off
echo.Processing...
setlocal ENABLEDELAYEDEXPANSION ENABLEEXTENSIONS
set "OutFile=cmd_help.html"
call:HtmlBgn >%OutFile%
set "CmdName="
set "CmdDesc="
set /a CmdCnt=1
echo.^<div id="catalogue"^> >>%OutFile%
echo.^<p^>^<h1^>Command Prompt Help Information^</h1^>^</p^> >>%OutFile%
echo.^<p^>^<h2^>Basic Network Commands^</h2^>^</p^> >>%OutFile%
call:AddCmdList "ARP","Physical address cache operation command." >>%OutFile%
call:AddCmdList "NET","Network application command for Windows, including user creation, remote login, and other features." >>%OutFile%
call:AddCmdList "NSLOOKUP","Host query command." >>%OutFile%
call:AddCmdList "NETSH","Powerful network configuration command" >>%OutFile%
call:AddCmdList "PING","Ping packet sending command, used for network testing." >>%OutFile%
call:AddCmdList "ROUTE","Local routing table command, used to configure routing priority order." >>%OutFile%
call:AddCmdList "TRACERT","Packet tracing command, used for route path detection." >>%OutFile%
echo.^<p^>^<h2^>Common Commands^</h2^>^</p^> >>%OutFile%
for /f "tokens=1,2* skip=1 delims= " %%i in ('help') do (
rem help has a command that wraps to the next line with only one space, requiring special handling. This is beyond me, I refuse to deal with it.
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
echo.Processing complete, press any key to exit...
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
echo.^<title^>Command Prompt Help Information^</title^>
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
