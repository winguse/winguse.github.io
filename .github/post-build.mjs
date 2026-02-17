import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";
import buildCache from "../src/.observablehq/cache/_build.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "../dist");

async function run() {
  console.log("Running post-build image captions generation...");
  
  for (const page of buildCache.pages) {
    const relativePath = page.path === "/" ? "/index.html" : page.path;
    const fullPath = path.join(distDir, relativePath);
    
    try {
      const html = await fs.readFile(fullPath, "utf-8");
      const $ = cheerio.load(html);
      let modified = false;
      
      $("main img").each((_, img) => {
        const $img = $(img);
        const alt = $img.attr("alt");
        if (alt && alt.trim()) {
          const parent = $img.parent();
          // If the parent is a paragraph, the image is the only element, and the paragraph text is empty
          if (parent.is("p") && parent.children().length === 1 && parent.text().trim() === "") {
            const figure = $("<figure></figure>")
              .append($img.clone())
              .append($("<figcaption></figcaption>").text(alt));
            parent.replaceWith(figure);
            modified = true;
          }
        }
      });
      
      if (modified) {
        await fs.writeFile(fullPath, $.html(), "utf-8");
        console.log(`  Added captions to: ${relativePath}`);
      }
    } catch (err) {
      console.error(`  Error processing ${relativePath}:`, err.message);
    }
  }
  
  console.log("Post-build image captions generation complete.");
}

run().catch((err) => {
  console.error("Error in post-build script:", err);
  process.exit(1);
});
