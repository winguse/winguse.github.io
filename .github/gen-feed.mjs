import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Feed } from "feed";
import { promises as fs } from 'fs';
import * as cheerio from 'cheerio';

import buildCache from '../src/.observablehq/cache/_build.json' with { type: "json" };

const base = 'https://wingu.se';
const email = 'emerald_cahoots0j@icloud.com';

const feed = new Feed({
  title: "Yingyu Pages",
  description: "Yingyu's blog hosted in GitHub Pages",
  id: base,
  link: base,
  language: "cn", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
  favicon: `${base}/favicon.ico`,
  copyright: "All rights reserved, Yingyu Cheng",
  updated: new Date(),
  generator: "Feed for Node.js",
  feedLinks: {
    json: `${base}/feed.json`,
    atom: `${base}/atom.xml`,
  },
  author: {
    name: "Yingyu Cheng",
    email,
    link: "https://github.com/winguse"
  }
});


const selectedPages = buildCache.pages.filter(({ path }) => /^\/\d{4}/.test(path)).sort(({ path: a }, { path: b }) => b.localeCompare(a)).slice(0, 10);

for (const { title, path } of selectedPages) {
  const html = await fs.readFile(`${__dirname}/../dist${path}`, 'utf-8');
  const pageUrl = `${base}${path}`;
  const $ = cheerio.load(html);
  const main = $('main')
  for (const attr of ['src', 'href']) {
    $(`[${attr}]`).each((_, el) => {
      const src = $(el).attr(attr);
      const abs = new URL(src, pageUrl);
      $(el).attr(attr, abs.toString());
    });
  };
  const [tsStr] = $('small script').html().match(/(\d+)/);
  const date = new Date(parseInt(tsStr));

  feed.addItem({
    title,
    id: pageUrl,
    link: pageUrl,
    description: main.text().slice(0, 100) + '...',
		content: `<p><img src="https://winguse.com/view-counter?r=wingu.se${path.replace(/\.html$/, '')}&from=feed" style="vertical-align: middle; height: 1em;"/></p>` + main.html(),
    author: [
      {
        name: "Yingyu Cheng",
        email,
        link: base,
      },
    ],
    contributor: [
      // {
      //   name: "First Last",
      //   email: "last@example.com",
      //   link: "https://example.com/first"
      // },
    ],
    date,
    // image: post.image
  });
}


await fs.writeFile(`${__dirname}/../dist/feed.json`, feed.json1());
await fs.writeFile(`${__dirname}/../dist/rss.xml`, feed.rss2());
await fs.writeFile(`${__dirname}/../dist/atom.xml`, feed.atom1());




