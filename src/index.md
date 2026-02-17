---
title: Yingyu Pages
date: 2024-08-04 11:39:00 -0700
---

你好啊！你可以在左边找到文章的列表，虽然我也没写了啥..

```js
const world = await FileAttachment("./data/countries-110m.json").json();
const land = topojson.feature(world, world.objects.land);
```

短的东西都在长毛象，比如最近一条：

<p>
<iframe src="about:blank" class="mastodon-embed" style="width: 100%; border: 0" allowfullscreen="allowfullscreen"></iframe><script src="https://m.wingu.se/embed.js" async="async"></script>
</p>

```js
async function getRecentMastodonUrl() {
  const recentReq = await fetch("https://m.wingu.se/@winguse.rss");
  const recentXml = await recentReq.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(recentXml, "application/xml");
  return [...doc.querySelectorAll("item link")].map((x) => x.textContent);
}
const urls = await getRecentMastodonUrl();
document.querySelector("iframe.mastodon-embed").src = urls[0] + "/embed";
```

```js
const longitude = view(
  Inputs.range([-180, 180], {
    label: "longitude",
    step: 1,
    value: 180,
  })
);
const latitude = view(
  Inputs.range([-90, 90], {
    label: "longitude",
    step: 1,
    value: 30,
  })
);
```

```js
const zhaoqing0 = {
  longitude: 112.46,
  latitude: 23.04,
  weight: 19,
};
const changchun = {
  longitude: 125.32,
  latitude: 43.81,
  weight: 4,
};
const beijing = {
  longitude: 116.4,
  latitude: 39.9,
  weight: 6,
};
const zhaoqing1 = {
  longitude: 112.46,
  latitude: 23.04,
  weight: 2,
};
const sunnyvale = {
  longitude: -122.03,
  latitude: 37.36,
  weight: 2,
};
const seattle = {
  longitude: -122.3,
  latitude: 47.6,
  weight: (new Date()).getFullYear() - 2023,
};
const visited = [zhaoqing0, changchun, beijing, zhaoqing1, sunnyvale, seattle];
visited.forEach((v) => (v.weight = Math.log(Math.log(v.weight))));
```

🏗️ 正在施工中的世界迷雾：

```js
const metros = [];

for (let i = 1; i < visited.length; i++) {
  metros.push({
    longitude1: visited[i - 1].longitude,
    latitude1: visited[i - 1].latitude,
    longitude2: visited[i].longitude,
    latitude2: visited[i].latitude,
  });
}

function distance({ longitude1, latitude1, longitude2, latitude2 }) {
  const long = longitude1 - longitude2;
  const lat = latitude1 - latitude2;
  return Math.sqrt(long * long + lat * lat);
}

display(
  Plot.plot({
    projection: { type: "orthographic", rotate: [-longitude, -latitude] },
    r: { transform: (d) => Math.pow(10, d) }, // convert Richter to amplitude
    style: "overflow: visible;", // allow dots to escape
    marks: [
      Plot.geo(land, { fill: "currentColor", fillOpacity: 0.2 }),
      Plot.sphere(),
      Plot.dot(visited, {
        x: "longitude",
        y: "latitude",
        r: "weight",
        stroke: "red",
        fill: "red",
        fillOpacity: 0.2,
      }),
      Plot.link(metros, {
        x1: "longitude1",
        y1: "latitude1",
        x2: "longitude2",
        y2: "latitude2",
        // stroke: distance,
        markerEnd: "arrow",
      }),
    ],
  })
);
```
