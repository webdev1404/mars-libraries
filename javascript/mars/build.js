// build.js
import fs from "fs";
import esbuild from "esbuild";

const ENTRY_FILE = "./.entry-js.js";

async function run() {
  // Load files.json
  const config = JSON.parse(fs.readFileSync("./files.json", "utf8"));

  // ---------------------------
  // Create virtual JS entry
  // ---------------------------
  let jsEntryContent = "";
  for (const file of config.js) {
    jsEntryContent += `import "./${file}";\n`;
  }

  fs.writeFileSync(ENTRY_FILE, jsEntryContent);

  try {
    // ---------------------------
    // Build JS
    // ---------------------------
    await esbuild.build({
      entryPoints: [ENTRY_FILE],
      bundle: true,
      minify: true,
      outfile: "dist/mars.js",
      loader: {
        ".css": "empty" // ensure no CSS output is generated from JS
      }
    });

    // ---------------------------
    // Build / Merge CSS
    // ---------------------------
    let cssContent = "";
    for (const file of config.css) {
      cssContent += fs.readFileSync(file, "utf8") + "\n";
    }

    const minifiedCss = await esbuild.transform(cssContent, {
      loader: "css",
      minify: true
    });

    fs.writeFileSync("dist/mars.css", minifiedCss.code);

    console.log("Build complete.");
  }

  finally {
    // ---------------------------
    // Cleanup temporary file
    // ---------------------------
    if (fs.existsSync(ENTRY_FILE)) {
      fs.unlinkSync(ENTRY_FILE);
      console.log("Cleaned up", ENTRY_FILE);
    }
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
