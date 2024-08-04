---
title: Yingyu Pages
date: 2024-08-04 11:39:00 -7000
---

你好啊！最近用 [Observable](https://observablehq.com/framework) 重构了一下博客，可是还不知道首页要放点啥。不过你可以在左边找到文章的列表，虽然我也没写了啥。

```js
const world = await FileAttachment("data/countries-110m.json").json();
const land = topojson.feature(world, world.objects.land);
```

```js
const longitude = view(
  Inputs.range([-180, 180], {
    label: "longitude",
    step: 1,
    value: -90,
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
const visited = [
  {
    longitude: -122.3,
    latitude: 47.6,
    weight: 100,
  },
];
```

🏗️ 正在施工中的世界迷雾：

```js
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
    ],
  })
);
```
