---
layout: post
title: "数论和Partition策略"
date: 2014-07-19 06:40:49 +0000
---

最近要 on board 一个新的 API，大概描述一下就是，有三种分组的数据：monthly, weekly 和 daily。因为查询针对连续时间区间的，同时更新也是按照时间一点点更新。我们要存半年的数据，也就是说，有 6 个月，26周，以及 180 天的数据。所谓连续的时间区间，就是查连续 6 个月的 monthly 的数据，连续 4 个周的 weekly 数据，以及连续 14 天的 daily 数据。不过我们使用的机器是 36 台，怎么合理地分配是个问题。

若按数据内部结构（例如 account id）来 partition 的话，数据更新就会很麻烦。因为你把所有时间维度的都存一个机器上了，而又要求按时间连续查，data load 的时候，要更新 clustered index ，这不是那么现实。所以，我们决定了，按照时间去 partition，对于一个 request 过来，并发到多个机器上面去查对应数据。是滴，这样子的确会有短板效应，不过看上去数据库的表现都还算稳定，所以且不考虑。

daily 的好说 \(\frac{180}{36} = 5\)，正好整除。但是呢，monthly 和 weekly 的加起来，才 32。在考虑尽可能避免 weekly 和 monthly 的 data load在同一个机器上面同时出现，所以呢，还是要有点策略的。monthly 的似乎没什么好计算的，因为每个月的长度都不一样，你最好就自己去模拟一下未来好几年都不发生就好了。但是 weekly 是 7 天一个周期，所以还是算一下吧。

假定 weekly 的数据和 daily 的数据都是从第一天开始的周期开始 load 的。设从第 0 个机器起 load daily 的数据，第 k 个机器起 load weekly 的数据，然后第 n 周他们在同一个机器上 load，然后有：

$$ 7n \mod 36 = n \mod 26 + k$$
令：
$$ 7n = 36x + a \\ n = 26y + b$$
其中：
$$ a = b + k $$
则：
$$
\begin{aligned}
8n & = 36x + b + k + 26y + b\\
36x + 26y & = 8n - 2b - k
\end{aligned}
$$

由扩展欧几里得可以知道：

$$ 36x + 26y = \gcd(36, 26) = 2$$

是有解的。两边同除以 2 有：
$$
\begin{aligned}
\frac{36x}{2} - \frac{26y}{2} & = \frac{8n - 2b - k}{2} \\
18x - 13y & = \frac{8n - 2b - k}{2}
\end{aligned}
$$
要 x, y 有整数解，则 \(\frac{8n - 2b - k}{2}\) 必须为 2 的倍数。

所以，只要 k 是奇数，那么久不存在 weekly 和 daily 的 load 在同一天出现。做了个网页模拟，[详情撮这](/0/partition.html)。

用扩展欧几里得：

```c++
int ext_gcd(int a, int b, int &x, int &y) {
    int t, ret;
    if(!b) {
        x = 1, y = 0;
        return a;
    }
    ret = ext_gcd(b, a % b, x, y);
    t = x, x = y, y = t - a / b * y;
    return ret;
}
```

求出一个解： \(x_0 = -5, y_0 = 7\)，因为原式可以写成， \( 36(x_0 + 13q) + 26(y_0 - 18q) = 2 \)，其中 q 是整数，所以通解就是
\( \begin{cases} \begin{aligned}x & = -5 + 13q \\ y & = 7 - 18q\end{aligned}\end{cases}\)

这个通解是针对 \( 36x + 26y = \gcd(36, 26) = 2 \) 的，而针对我们要求的，应该是\( \begin{cases} \begin{aligned} x & = -5 \times \frac{8n - 2b - k}{2}  + 13q \\ y & = 7 \times \frac{8n - 2b - k}{2} - 18q\end{aligned}\end{cases}\)



我弄了一个下午，还没想明白怎么求出当 k = 10的时候的 n。

唉，其实老实说，数论当初就没学好，很多细节证明我这里就略过了。哪怕上上面这堆不严谨的东西，也折腾了我大半天，真心变差了。
