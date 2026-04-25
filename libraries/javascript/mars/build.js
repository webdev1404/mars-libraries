// build.js
import fs from "fs";
import esbuild from "esbuild";


const OUTPUT_JS = "dist/mars.js";
const OUTPUT_CSS = "dist/mars.css";

async function run() {
  // Load files.json
  const config = JSON.parse(fs.readFileSync("./files.json", "utf8"));

  try {
    // ---------------------------
    // Merge and Minify JS
    // ---------------------------
    let jsContent = "";
    for (const file of config.js) {
      jsContent += fs.readFileSync(file, "utf8") + "\n";
    }

    const minifiedJs = await esbuild.transform(jsContent, {
      loader: "js",
      minify: true
    });

    fs.writeFileSync(OUTPUT_JS, minifiedJs.code);

    // ---------------------------
    // Merge and Minify CSS
    // ---------------------------
    let cssContent = "";
    for (const file of config.css) {
      cssContent += fs.readFileSync(file, "utf8") + "\n";
    }

    const minifiedCss = await esbuild.transform(cssContent, {
      loader: "css",
      minify: true
    });

    fs.writeFileSync(OUTPUT_CSS, minifiedCss.code);

    console.log("Build complete.");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
}

run();