---
layout: post
title: "slim 404 for query string in nginx"
date: 2014-11-01 14:56:44 +0000
---

If you try to access your slim routing with some query string parameter, like <code>http://foo/bar?parm=balabala</code>, you will probably get a 404 response.

The main reason is, the documented config of slim is telling you to rewrite the uri by:

<pre>
try_files $uri /app/github/index.php;
</pre>

try to update it to:

<pre>
try_files $uri /app/github/index.php?$args;
</pre>

see [a post of discussion deeply hided in the froum](http://help.slimframework.com/discussions/problems/993-nginx-slim-in-sub-directory).
