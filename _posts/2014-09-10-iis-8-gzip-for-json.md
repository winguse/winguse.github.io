---
layout: post
title: "IIS 8 中对 json 启用 gzip"
date: 2014-09-10 06:51:01 +0000
---

这是个很奇怪的问题，不过就是发生了。默认情况下面， json是没有被gzip的，当带宽比较吃紧的时候，这是个性能的瓶颈。

本来想着在 web.config 里面加上这个就可以 work 的：

```xml
<system.webServer>
<httpCompression directory="%SystemDrive%\inetpub\temp\IIS Temporary Compressed Files">
            <scheme name="gzip" dll="%Windir%\system32\inetsrv\gzip.dll" />
        <dynamicTypes>
            <add mimeType="text/*" enabled="true" />
            <add mimeType="message/*" enabled="true" />
            <add mimeType="application/x-javascript" enabled="true" />
            <add mimeType="application/json; charset=utf-8" enabled="true" />
            <add mimeType="*/*" enabled="false" />
        </dynamicTypes>
        <staticTypes>
            <add mimeType="text/*" enabled="true" />
            <add mimeType="message/*" enabled="true" />
            <add mimeType="application/x-javascript" enabled="true" />
            <add mimeType="application/atom+xml" enabled="true" />
            <add mimeType="application/xaml+xml" enabled="true" />
            <add mimeType="*/*" enabled="false" />
        </staticTypes>   
</httpCompression>
</system.webServer>
```

偏偏不行，原因是，<code>%SystemRoot%\System32\inetsrv\config\applicationHost.config</code>里面默认情况下面，不允许 override：

```xml
<section name="httpCompression" overrideModeDefault="Allow" /> <!--default is Deny-->
```


最后，查到这个命令，然后就可以了，当然，你也可以自己修改 applicationHost.config 。

```bat
%SystemRoot%\System32\Inetsrv\Appcmd.exe set config -section:system.webServer/httpCompression /+"dyn
amicTypes.[mimeType='application/json',enabled='True']" /commit:apphost
%SystemRoot%\System32\Inetsrv\Appcmd.exe set config -section:system.webServer/httpCompression /+"dyn
amicTypes.[mimeType='application/json; charset=utf-8',enabled='True']" /commit:apphost
```
