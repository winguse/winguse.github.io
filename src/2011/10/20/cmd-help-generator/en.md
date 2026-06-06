---
title: "Translated English Version"
date: 2011-10-20 03:42:32 +0000
---

translated text Shell translated text，translated text。

translated text，translated text，translated text，translated text，translated text，translated text，translated text。

translated text，translated text CMD translated text。translated text，translated text，translated text 2 translated text，translated text，translated text：

```bat
@echo off
echo.translated text...
setlocal ENABLEDELAYEDEXPANSION ENABLEEXTENSIONS
set "OutFile=cmd_help.html"
call:HtmlBgn >%OutFile%
set "CmdName="
set "CmdDesc="
set /a CmdCnt=1
echo.^<div id="catalogue"^> >>%OutFile%
echo.^<p^>^<h1^>translated text^</h1^>^</p^> >>%OutFile%
echo.^<p^>^<h2^>translated text^</h2^>^</p^> >>%OutFile%
call:AddCmdList "ARP","translated text。" >>%OutFile%
call:AddCmdList "NET","Windowstranslated text，translated text、translated text。" >>%OutFile%
call:AddCmdList "NSLOOKUP","translated text。" >>%OutFile%
call:AddCmdList "NETSH","translated text" >>%OutFile%
call:AddCmdList "PING","pingtranslated text，translated text。" >>%OutFile%
call:AddCmdList "ROUTE","translated text，translated text。" >>%OutFile%
call:AddCmdList "TRACERT","translated text，translated text。" >>%OutFile%
echo.^<p^>^<h2^>translated text^</h2^>^</p^> >>%OutFile%
for /f "tokens=1,2* skip=1 delims= " %%i in ('help') do (
rem helptranslated text，translated text，translated text，translated text。
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
echo.translated text，translated text...
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
echo.^<title^>translated text^</title^>
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

translated text，translated text，translated text：

translated text：

```
ping
nslookup
tracert
```

translated text：

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
