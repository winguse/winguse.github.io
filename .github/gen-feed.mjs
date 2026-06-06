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

const selectedPages = buildCache.pages
  .filter(({ path }) => /^\/\d{4}/.test(path))
  .sort(({ path: a }, { path: b }) => b.localeCompare(a));

function createFeed(lang) {
  const isEn = lang === "en";
  return new Feed({
    title: isEn ? "Yingyu Pages (English)" : "Yingyu Pages",
    description: isEn
      ? "Yingyu's blog hosted in GitHub Pages (English posts)"
      : "Yingyu's blog hosted in GitHub Pages",
    id: isEn ? `${base}/en` : base,
    link: base,
    language: isEn ? "en" : "zh-cn",
    favicon: `${base}/favicon.ico`,
    copyright: "All rights reserved, Yingyu Cheng",
    updated: new Date(),
    generator: "Feed for Node.js",
    feedLinks: {
      json: isEn ? `${base}/feed-en.json` : `${base}/feed.json`,
      atom: isEn ? `${base}/atom-en.xml` : `${base}/atom.xml`,
    },
    author: {
      name: "Yingyu Cheng",
      email,
      link: "https://github.com/winguse",
    },
  });
}

function extractDate($, pagePath) {
  const scriptHtml = $("small script").html();
  const tsMatch = scriptHtml?.match(/(\d+)/);
  if (tsMatch) return new Date(Number(tsMatch[1]));
  const pathMatch = pagePath.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (pathMatch) {
    const [, year, month, day] = pathMatch;
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  }
  return new Date();
}

async function addItemsToFeed(feed, pages) {
  for (const { title, path } of pages) {
  const html = await fs.readFile(`${__dirname}/../dist${path}`, "utf-8");
  const pageUrl = `${base}${path}`;
  const $ = cheerio.load(html);
  const main = $("main");
  for (const attr of ["src", "href"]) {
    $(`[${attr}]`).each((_, el) => {
      const src = $(el).attr(attr);
      if (!src || /^(#|mailto:|tel:|javascript:)/i.test(src)) return;
      try {
        const abs = new URL(src, pageUrl);
        $(el).attr(attr, abs.toString());
      } catch {
        // ignore malformed url values
      }
    });
  }
    const date = extractDate($, path);

    feed.addItem({
      title,
      id: pageUrl,
      link: pageUrl,
      description: `${main.text().trim().slice(0, 100)}...`,
      content:
        `<p><img src="https://winguse.com/view-counter?r=wingu.se${path.replace(/\.html$/, "")}&from=feed" style="vertical-align: middle; height: 1em;"/></p>` +
        main.html(),
      author: [
        {
          name: "Yingyu Cheng",
          email,
          link: base,
        },
      ],
      contributor: [],
      date,
    });
  }
}

const zhPages = selectedPages.filter(({ path }) => !path.endsWith("/en")).slice(0, 10);
const enPages = selectedPages.filter(({ path }) => path.endsWith("/en")).slice(0, 10);

const zhFeed = createFeed("zh");
const enFeed = createFeed("en");

await addItemsToFeed(zhFeed, zhPages);
await addItemsToFeed(enFeed, enPages);

await fs.writeFile(`${__dirname}/../dist/feed.json`, zhFeed.json1());
await fs.writeFile(`${__dirname}/../dist/rss.xml`, zhFeed.rss2());
await fs.writeFile(`${__dirname}/../dist/atom.xml`, zhFeed.atom1());
await fs.writeFile(`${__dirname}/../dist/feed-en.json`, enFeed.json1());
await fs.writeFile(`${__dirname}/../dist/rss-en.xml`, enFeed.rss2());
await fs.writeFile(`${__dirname}/../dist/atom-en.xml`, enFeed.atom1());
