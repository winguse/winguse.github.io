---
layout: post
title: "解决 Chart.js 在 flex 布局下无脑增大的问题"
date: 2016-05-22 08:43:14 +0000
---

先看代码：

```html
<style>
    html, body {
        margin: 0;
        padding: 0;
    }
    .container {
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .container > .left {
        background: #ecc;
        flex-grow: 0;
        flex-shrink: 0;
        width: 20%;
        min-width: 200px;
        max-width: 400px;
    }
    .container > .right {
        background: #cce;
        flex-grow: 1;
        flex-shrink: 1;
        overflow-x: hidden;
    }
</style>
 
<div class="container">
    <div class="left">
        Some what
    </div>
    <div class="right">
        <canvas id="myChart" width="400" height="200"></canvas>
    </div>
</div>
 
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.min.js"></script>
<script>
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3]
        }]
    }
});
</script>
```

解决方案就是，将包含 chart.js 的容器的 overflow 属性设置为 hidden。原因是这样的：chat.js 默认是使用 hook 一个插入的 iframe 标签的 resize 事件（我也不好说这样好不好，还没仔细研究）来决定是不是要更改 canvar 的大小。不过由于在 flex 布局下，如果子元素存在固定宽度，那么它不会强制去压缩子元素的大小，哪怕你设定了 flex-shrink: 1。

这个方案也是我千辛百苦实验处理的，好难过啊，这样的东西好难整理。如果你踩到这个坑了，希望你比我好运点。

[点击这里查看样例](https://winguse.com/demos/Fix-Chart.js-in-flex-always-growing-problem.html)。
