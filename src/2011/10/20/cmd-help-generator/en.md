---
title: "Generating Help for CMD Commands"
date: 2011-10-20 03:42:32 +0000
---

Our software engineering teacher wanted us to get familiar with Shell commands and write down those switches and such.

Actually, I wasn't very willing to do it. After all, for things like this, it's enough to look up the manual and use them properly. Writing them all down is too much work and doesn't help learning that much.

I started writing batch files in middle school, so I used to know those CMD commands very well back then. I'm rusty now, though. After fumbling around for more than two hours, late at night, I finished this:

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

Actually, there really aren't that many commands that are commonly used. I'll just casually list the very common ones:

Networking:

```
ping
nslookup
tracert
```

General:

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
