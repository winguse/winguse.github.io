import mathjax from "markdown-it-mathjax3";
import { promises as fs } from "fs";
import path from "path";

async function getMarkdownFiles(dir) {
  let markdownFiles = [];

  async function traverseDirectory(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await traverseDirectory(fullPath); // Recursively traverse subdirectories
      } else if (path.extname(entry.name) === ".md") {
        markdownFiles.push(fullPath);
      }
    }
  }

  await traverseDirectory(dir);
  return markdownFiles;
}

async function parseMarkdownFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const frontMatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);

  if (!frontMatterMatch) {
    throw new Error(`No front matter found in ${filePath}`);
  }

  const frontMatter = frontMatterMatch[1];
  const titleMatch = frontMatter.match(/title:\s*["']?(.+?)["']?\n/);
  const timeMatch = frontMatter.match(/date:\s*(.+?)(\n|$)/);

  if (!titleMatch)
    throw new Error(`No title found in front matter of ${filePath}`);

  if (!timeMatch)
    throw new Error(
      `No date found in front matter of ${filePath} ${frontMatter}`,
    );

  const title = titleMatch[1];
  const time = new Date(timeMatch[1]);
  return {
    title,
    time,
    path: filePath.replace(/^src\//, "").replace(/\.md$/, ""),
  };
}

const path2time = {};
const translationMap = {};

async function listAndGroupMarkdownFiles(dir) {
  const markdownFiles = await getMarkdownFiles(dir);
  const regularPostMap = {};
  const pages = [];

  for (const file of markdownFiles) {
    const { time, title, path: filePath } = await parseMarkdownFile(file);
    const fullPath = "/" + filePath;
    path2time[fullPath] = time;

    let lang = "zh";
    let basePath = fullPath;
    if (fullPath.endsWith("/en")) {
      lang = "en";
      basePath = fullPath.slice(0, -3);
    }

    if (!translationMap[basePath]) translationMap[basePath] = {};
    translationMap[basePath][lang] = title;

    if (lang === "en") continue;

    const regular = /^\d{4}/.test(filePath);
    if (regular) {
      const year = time.getFullYear();
      if (!regularPostMap[year]) regularPostMap[year] = [];
      regularPostMap[year].push({ title, time, path: filePath });
    } else {
      if (filePath !== "index") pages.push({ name: title, path: filePath });
    }
  }

  return [
    ...pages,
    ...Object.keys(regularPostMap)
      .sort()
      .reverse()
      .flatMap((year, idx) => {
        const posts = regularPostMap[year];
        return {
          name: year,
          open: idx === 0,
          pages: posts
            .sort((a, b) => b.time - a.time)
            .map(({ title, path }) => ({ name: title, path })),
        };
      }),
  ];
}

// See https://observablehq.com/framework/config for documentation.
export default {
  markdownIt: (md) => md.use(mathjax),



  // The project’s title; used in the sidebar and webpage titles.
  title: "Yingyu Pages",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: await listAndGroupMarkdownFiles("./src/"),

  // Content to add to the head of the page, e.g. for a favicon:
  head: `
  <link rel="icon" href="images/favicon.ico" type="image/ico" sizes="64x64">
  <link rel="stylesheet" type="text/css" href="style/default.css">
  <link rel="alternate" type="application/json" href="https://wingu.se/feed.json" title="Yingyu Pages JSON Feed">
  <link rel="alternate" type="application/atom+xml" href="https://wingu.se/atom.xml" title="Yingyu Pages Atom Feed">
  <link rel="alternate" type="application/rss+xml" href="https://wingu.se/rss.xml" title="Yingyu Pages RSS Feed">
  <link rel="alternate" type="application/json" href="https://wingu.se/feed-en.json" title="Yingyu Pages JSON Feed (English)">
  <link rel="alternate" type="application/atom+xml" href="https://wingu.se/atom-en.xml" title="Yingyu Pages Atom Feed (English)">
  <link rel="alternate" type="application/rss+xml" href="https://wingu.se/rss-en.xml" title="Yingyu Pages RSS Feed (English)">
  <script>
    window.translationMap = ${JSON.stringify(translationMap)};
    (function() {
      const preferredLang = localStorage.getItem('lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en');
      const currentPath = window.location.pathname.replace(/\\.html$/, '').replace(/\\/$/, '');
      const isEn = currentPath.endsWith('/en') || currentPath === '/en';
      const currentLang = isEn ? 'en' : 'zh';

      if (preferredLang !== currentLang) {
        const basePath = isEn ? currentPath.slice(0, -3) : (currentPath === '' ? '/index' : currentPath);
        const targetPath = preferredLang === 'en' ? (basePath + '/en') : (basePath === '/index' ? '/' : basePath);
        if (window.translationMap[basePath] && window.translationMap[basePath][preferredLang]) {
          window.location.href = (targetPath === '/' ? '/' : targetPath + '.html');
        }
      }

      function updateSidebar() {
        const isEn = window.location.pathname.replace(/\\.html$/, '').endsWith('/en');
        if (isEn) {
          document.querySelectorAll('#observablehq-sidebar a').forEach(a => {
            const href = a.pathname.replace(/\\.html$/, '');
            const base = href.endsWith('/en') ? href.slice(0, -3) : href;
            if (window.translationMap[base] && window.translationMap[base].en) {
              a.innerText = window.translationMap[base].en;
              if (!a.pathname.includes('/en.html')) {
                a.setAttribute('href', base + '/en.html');
              }
            }
          });
        }
      }
      document.addEventListener('DOMContentLoaded', updateSidebar);
      // Also observe for sidebar changes (Observable Framework might re-render)
      const observer = new MutationObserver(updateSidebar);
      document.addEventListener('DOMContentLoaded', () => {
        const sidebar = document.querySelector('#observablehq-sidebar');
        if (sidebar) observer.observe(sidebar, { childList: true, subtree: true });
      });
    })();
  </script>
  `,

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  header: ({ title, path }) => {
    const fullPath = "/" + path.replace(/^\//, "").replace(/\.html$/, "");
    let lang = "zh";
    let basePath = fullPath;
    if (fullPath.endsWith("/en")) {
      lang = "en";
      basePath = fullPath.slice(0, -3);
    } else if (fullPath === "/en") {
      lang = "en";
      basePath = "/index";
    }

    const otherLang = lang === "zh" ? "en" : "zh";
    const hasTranslation =
      translationMap[basePath] && translationMap[basePath][otherLang];

    let switcher = "";
    if (hasTranslation) {
      let targetLink = "";
      if (otherLang === "en") {
        targetLink =
          (basePath === "/index" ? "/index/en" : basePath + "/en") + ".html";
      } else {
        targetLink = basePath === "/index" ? "/" : basePath + ".html";
      }
      switcher = `<div style="position: absolute; top: 10px; right: 10px;">
        <a href="${targetLink}" onclick="localStorage.setItem('lang', '${otherLang}')">${otherLang === "en" ? "English" : "中文"}</a>
      </div>`;
    }

    const ts = path2time[fullPath]?.getTime();
    const timeScript = ts
      ? `<script>document.write(new Date(${ts}).toLocaleString())</script>`
      : "";
    return `${switcher}<h1>${title}</h1><small>${timeScript} <img src="https://winguse.com/view-counter?r=wingu.se${fullPath}" style="vertical-align: middle; height: 1em;"/></small>`;
  }, // what to show in the header (HTML)
  footer: ({ path }) => {
    const isEn = path.replace(/\.html$/, "").endsWith("/en");
    const feedEnSuffix = isEn ? "-en" : "";
    return `
<section id="isso-thread">
    <noscript>Javascript needs to be activated to view comments.</noscript>
</section>
<script data-isso="https://comments.wingu.se/" src="https://comments.wingu.se/js/embed.min.js" data-isso-css="false"></script>
<div id="footer">
  © ${new Date().getFullYear()}
  ${[
    ["github", "winguse", "https://github.com/winguse"],
    ["mastodon", "winguse", "https://m.wingu.se/@winguse"],
    ["rss", "RSS", `https://wingu.se/rss${feedEnSuffix}.xml`],
    ["rss", "Atom", `https://wingu.se/atom${feedEnSuffix}.xml`],
  ]
    .map(
      ([icon, username, url]) => `
  <a href="${url}"${icon !== "rss" ? ' rel="me"' : ""}>
    <svg class="svg-icon">
      <use xlink:href="https://wingu.se/minima-social-icons.svg#${icon}"></use>
    </svg>
    <span class="username">${username}</span>
  </a>
`,
    )
    .join("")}
<a href="https://comments.wingu.se:8443/about" style="width: 0; height: 0; display: block; overflow: hidden;">Honeypot</a>
</div>
  `;
  }, // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  cleanUrls: false, // drop .html from URLs
};
