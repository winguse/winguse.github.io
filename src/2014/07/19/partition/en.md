---
title: "Number Theory and a Partition Strategy"
date: 2014-07-19 06:40:49 +0000
---

Recently we needed to on board a new API. Roughly speaking, there are three groups of data: monthly, weekly, and daily. Queries are against continuous time ranges, and updates are also done gradually over time. We need to store half a year's worth of data, which means 6 months, 26 weeks, and 180 days of data. By a continuous time range, I mean querying 6 consecutive months of monthly data, 4 consecutive weeks of weekly data, and 14 consecutive days of daily data. But we are using 36 machines, so how to distribute this reasonably becomes a problem.

If we partition according to the internal structure of the data (for example, account id), updates become troublesome. Because then you would store all time dimensions on one machine, yet queries are required to be continuous by time. During data load, you would need to update the clustered index, and that is not very realistic. So we decided to partition by time instead, and when a request comes in, query the corresponding data from multiple machines in parallel. Yes, this does create a weakest-link effect, but the database performance seems fairly stable, so for now we won't consider that.

daily is easy: \(\frac{180}{36} = 5\), which divides evenly. But monthly plus weekly only adds up to 32. Since we want to avoid weekly and monthly data loads happening on the same machine at the same time as much as possible, we still need some strategy. There doesn't seem to be much to calculate for monthly, because each month has a different length, so it's probably best just to simulate it and make sure nothing happens over the next several years. But weekly has a 7-day cycle, so it's worth calculating.

Assume that weekly data and daily data are both loaded starting from the cycle beginning on the first day. Let daily data start loading from machine 0, weekly data from machine k, and suppose that in week n they are loaded onto the same machine. Then:

$$ 7n \mod 36 = n \mod 26 + k$$
Let:
$$ 7n = 36x + a \\ n = 26y + b$$
where:
$$ a = b + k $$
Then:

$$
\begin{aligned}
8n & = 36x + b + k + 26y + b\\
36x + 26y & = 8n - 2b - k
\end{aligned}
$$

From the extended Euclidean algorithm we know that:

$$ 36x + 26y = \gcd(36, 26) = 2$$

so there is a solution. Dividing both sides by 2 gives:

$$
\begin{aligned}
\frac{36x}{2} - \frac{26y}{2} & = \frac{8n - 2b - k}{2} \\
18x - 13y & = \frac{8n - 2b - k}{2}
\end{aligned}
$$

For x and y to have integer solutions, \(\frac{8n - 2b - k}{2}\) must be a multiple of 2.

So as long as k is odd, weekly and daily loads will never occur on the same day. I made a web page to simulate it.

Using the extended Euclidean algorithm:

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

One solution is: \(x_0 = -5, y_0 = 7\). Since the original equation can be written as \( 36(x_0 + 13q) + 26(y_0 - 18q) = 2 \), where q is an integer, the general solution is
\( \begin{cases} \begin{aligned}x & = -5 + 13q \\ y & = 7 - 18q\end{aligned}\end{cases}\)

This general solution is for \( 36x + 26y = \gcd(36, 26) = 2 \), but for what we need, it should be \( \begin{cases} \begin{aligned} x & = -5 \times \frac{8n - 2b - k}{2} + 13q \\ y & = 7 \times \frac{8n - 2b - k}{2} - 18q\end{aligned}\end{cases}\)

I spent an entire afternoon on this and still haven't figured out how to solve for n when k = 10.

Sigh. To be honest, I didn't learn number theory well back then, and I skipped over many detailed proofs here. Even the somewhat imprecise pile of stuff above still cost me most of an afternoon. I've really gotten worse.
