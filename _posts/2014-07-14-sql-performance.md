---
layout: post
title: "SQL查询性能一个囧事"
date: 2014-07-14 12:18:45 +0000
---

最近写一个 SQL 去查一些调用的 Log，因为我是针对特定的用户去做的（准确说，是因为我要调研一个 partition 的用户），所以 filter 条件就是一堆的 account_id。

很自然的想法就是这样的：

<pre class="brush: sql; collapse: false">SELECT * FROM account_db WHERE account_id in (1, 2, 3, 4, ... x)</pre>
很囧，发现我这种写法翻译之后，变成了：
<pre class="brush: sql; collapse: false">SELECT * FROM account_db WHERE account_id = 1 OR account_id = 2 OR ... account_id = x</pre>
可能你觉得不咋样，实际上，我这里大概有十多万个 account_id... 于是瞬间觉得很不科学，这可是一个 O(N) 的 filter 啊，最后用了个临时表存起来，做了个 inner join。

具体各个数据库对于 IN 语句的实现不太了解，我只是看到了我现在这个解析出来的语句让我觉得性能很担忧。实际上，设计者应该意识到 IN 里面应该传一个集合，应该用一个 hash set 的东西去加快效率。不过当然啦，很少有人像我这样生成个这样的查询语句的，呵呵。
