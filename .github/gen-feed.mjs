import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Feed } from "feed";
import { promises as fs } from "fs";
import * as cheerio from "cheerio";

import buildCache from "../src/.observablehq/cache/_build.json" with { type: "json" };

const base = "https://wingu.se";
const email = "emerald_cahoots0j@icloud.com";
const authorInfo = {
  name: "Yingyu Cheng",
  email,
  link: "https://github.com/winguse",
};

const feedZh = new Feed({
  title: "Yingyu Pages",
  description: "Yingyu's blog hosted in GitHub Pages",
  id: base,
  link: base,
  language: "zh",
  favicon: `${base}/favicon.ico`,
  copyright: "All rights reserved, Yingyu Cheng",
  updated: new Date(),
  generator: "Feed for Node.js",
  feedLinks: {
    json: `${base}/feed.json`,
    atom: `${base}/atom.xml`,
  },
  author: authorInfo,
});

const feedEn = new Feed({
  title: "Yingyu Pages (English)",
  description: "Yingyu's blog hosted in GitHub Pages (English)",
  id: `${base}/en`,
  link: `${base}/en`,
  language: "en",
  favicon: `${base}/favicon.ico`,
  copyright: "All rights reserved, Yingyu Cheng",
  updated: new Date(),
  generator: "Feed for Node.js",
  feedLinks: {
    json: `${base}/feed-en.json`,
    atom: `${base}/atom-en.xml`,
  },
  author: authorInfo,
});

async function addPageToFeed(feed, { title, path: pagePath }) {
  const html = await fs.readFile(`${__dirname}/../dist${pagePath}`, "utf-8");
  const pageUrl = `${base}${pagePath}`;
  const $ = cheerio.load(html);
  const main = $("main");
  for (const attr of ["src", "href"]) {
    $(`[${attr}]`).each((_, el) => {
      const src = $(el).attr(attr);
      try {
        const abs = new URL(src, pageUrl);
        $(el).attr(attr, abs.toString());
      } catch {
        // ignore invalid URLs
      }
    });
  }
  const scriptHtml = $("small script").html();
  const tsMatch = scriptHtml && scriptHtml.match(/(\d+)/);
  if (!tsMatch) {
    console.warn(`Warning: no timestamp found for ${pagePath}, using current time`);
  }
  const date = tsMatch ? new Date(parseInt(tsMatch[1])) : new Date();

  feed.addItem({
    title,
    id: pageUrl,
    link: pageUrl,
    description: main.text().slice(0, 100) + "...",
    content:
      `<p><img src="https://pv.wingu.se/?r=wingu.se${pagePath.replace(/\.html$/, "")}&from=feed" style="vertical-align: middle; height: 1em;"/></p>` +
      main.html(),
    author: [authorInfo],
    date,
  });
}

const allDatePages = buildCache.pages
  .filter(({ path }) => /^\/\d{4}/.test(path))
  .sort(({ path: a }, { path: b }) => b.localeCompare(a));

const zhPages = allDatePages
  .filter(({ path }) => !path.replace(/\.html$/, "").endsWith("/en"))
  .slice(0, 10);

const enPages = allDatePages
  .filter(({ path }) => path.replace(/\.html$/, "").endsWith("/en"))
  .slice(0, 10);

for (const page of zhPages) {
  await addPageToFeed(feedZh, page);
}

for (const page of enPages) {
  await addPageToFeed(feedEn, page);
}

await fs.writeFile(`${__dirname}/../dist/feed.json`, feedZh.json1());
await fs.writeFile(`${__dirname}/../dist/rss.xml`, feedZh.rss2());
await fs.writeFile(`${__dirname}/../dist/atom.xml`, feedZh.atom1());
await fs.writeFile(`${__dirname}/../dist/feed-en.json`, feedEn.json1());
await fs.writeFile(`${__dirname}/../dist/rss-en.xml`, feedEn.rss2());
await fs.writeFile(`${__dirname}/../dist/atom-en.xml`, feedEn.atom1());
