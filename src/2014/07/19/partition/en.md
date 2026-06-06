---
title: "Number Theory and Partition Strategy"
date: 2014-07-19 06:40:49 +0000
---

Recently we needed to onboard a new API. In short, there are three grouped datasets: monthly, weekly, and daily. Queries target continuous time ranges, and updates are also applied incrementally by time. We store half a year of data: 6 months, 26 weeks, and 180 days. \"Continuous range\" means querying consecutive monthly data (up to 6 months), consecutive weekly data (4 weeks), and consecutive daily data (14 days). We have 36 machines, so allocating data reasonably is the key problem.

If we partition by internal data structure (for example account id), updates become painful. You would store all time dimensions on one machine, yet need time-continuous queries; loading data would require heavy clustered-index updates, which is not practical. So we chose time-based partitioning: when a request arrives, fan out concurrently to multiple machines for corresponding slices. Yes, this introduces a short-board effect, but database performance looked stable enough, so we ignored that for now.

`daily` is easy: \(\frac{180}{36} = 5\), perfectly divisible. But `monthly + weekly` only totals 32. We wanted to avoid having weekly and monthly loads collide on the same machine as much as possible, so we needed a strategy. Monthly alignment is hard to model mathematically because month lengths vary, so simulation is more practical. Weekly data has a 7-day period, so we can compute that part.

Assume weekly and daily loads both start from day 1 of their cycles. Let daily data start loading from machine 0, and weekly data start from machine `k`. If they collide on the same machine in week `n`, then:

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

From extended Euclid:

$$ 36x + 26y = \gcd(36, 26) = 2$$

there is a solution. Dividing both sides by 2:

$$
\begin{aligned}
\frac{36x}{2} - \frac{26y}{2} & = \frac{8n - 2b - k}{2} \\
18x - 13y & = \frac{8n - 2b - k}{2}
\end{aligned}
$$

For integer solutions in `x, y`, \(\frac{8n - 2b - k}{2}\) must be a multiple of 2.

So if `k` is odd, weekly and daily loads never collide on the same day. I also made a web simulation.

Using extended Euclid:

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

One solution is \(x_0 = -5, y_0 = 7\). Since the original equation can be written as \( 36(x_0 + 13q) + 26(y_0 - 18q) = 2 \), where `q` is an integer, the general solution is:
\( \begin{cases} \begin{aligned}x & = -5 + 13q \\ y & = 7 - 18q\end{aligned}\end{cases}\)

This general solution targets \( 36x + 26y = \gcd(36, 26) = 2 \). For our actual requirement, it should be \( \begin{cases} \begin{aligned} x & = -5 \times \frac{8n - 2b - k}{2} + 13q \\ y & = 7 \times \frac{8n - 2b - k}{2} - 18q\end{aligned}\end{cases}\).

I spent an entire afternoon and still did not figure out how to solve `n` when `k = 10`.

Honestly, I never learned number theory well, so I skipped many proof details here. Even this not-so-rigorous derivation cost me most of the day—my math skills really got rusty.
