/**
 * build_html.js — Bundle Script for Offline Standalone Website
 *
 * SOURCE OF TRUTH:
 *   - HTML & UI: index.html
 *   - CSS:       css/style.css
 *   - Logic:     js/app.js
 *   - Storage:   js/storage.js
 *   - Questions: data/subjects.json, data/subjects/*.json
 *
 * This script reads index.html and produces PoF-QuestionBank-website.html,
 * a 100% fully self-contained single-file bundle that embeds all CSS styles,
 * subjects, questions, media assets, and JS code inline so it can be opened
 * completely offline via file:// without CORS or missing asset issues.
 *
 * Usage:
 *   node build_html.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT        = __dirname;
const SOURCE      = path.join(ROOT, 'index.html');
const SINGLE_FILE = path.join(ROOT, 'PoF-QuestionBank-website.html');

if (!fs.existsSync(SOURCE)) {
  console.error('ERROR: Source file not found: ' + SOURCE);
  process.exit(1);
}

let html = fs.readFileSync(SOURCE, 'utf8');

// 1. Inline CSS Stylesheet (css/style.css)
const cssPath = path.join(ROOT, 'css', 'style.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const cssLinkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']\.\/css\/style\.css["'][^>]*>/i;
  if (cssLinkRegex.test(html)) {
    html = html.replace(cssLinkRegex, `<!-- Inlined Style for Offline Standalone Bundle -->\n  <style>\n${cssContent}\n  </style>`);
  }
}

// 2. Inline QR Image as Base64 Data URI if present
const qrPath = path.join(ROOT, 'donate_qr.jpg');
if (fs.existsSync(qrPath)) {
  const qrBase64 = fs.readFileSync(qrPath).toString('base64');
  const qrDataUri = `data:image/jpeg;base64,${qrBase64}`;
  html = html.replace(/src=["'](?:\.\/)?donate_qr\.jpg["']/g, `src="${qrDataUri}"`);
}

// 3. Load subjects manifest and question data
const subjectsFile = path.join(ROOT, 'data', 'subjects.json');
const subjects = JSON.parse(fs.readFileSync(subjectsFile, 'utf8'));

const embeddedData = {};
for (const s of subjects) {
  const qFilePath = path.join(ROOT, s.file);
  if (fs.existsSync(qFilePath)) {
    embeddedData[s.id] = JSON.parse(fs.readFileSync(qFilePath, 'utf8'));
  }
}

// 4. Load storage.js and app.js
const storageJs = fs.readFileSync(path.join(ROOT, 'js', 'storage.js'), 'utf8');
const appJs     = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');

// 5. Replace external script tags with inlined embedded data and scripts
const scriptTagsRegex = /<script\s+src=["']\.\/js\/storage\.js[^"']*["']><\/script>\s*<script\s+src=["']\.\/js\/app\.js[^"']*["']><\/script>/i;

const inlinedBundle = `<!-- Embedded Multi-Subject Offline Bundle Data -->
  <script>
    window.EMBEDDED_SUBJECTS = ${JSON.stringify(subjects)};
    window.EMBEDDED_DATA = ${JSON.stringify(embeddedData)};
  </script>
  <!-- Storage Layer -->
  <script>
${storageJs}
  </script>
  <!-- Core Application Logic -->
  <script>
${appJs}
  </script>`;

if (scriptTagsRegex.test(html)) {
  html = html.replace(scriptTagsRegex, inlinedBundle);
} else {
  console.warn('Warning: External script tags for js/storage.js & js/app.js not found in index.html, skipping inlining.');
}

fs.writeFileSync(SINGLE_FILE, html, 'utf8');

const srcKB = (fs.statSync(SOURCE).size      / 1024).toFixed(1);
const outKB = (fs.statSync(SINGLE_FILE).size / 1024).toFixed(1);

console.log('Built 100% standalone offline bundle successfully!');
console.log('  Source : index.html                     (' + srcKB + ' KB)');
console.log('  Output : PoF-QuestionBank-website.html  (' + outKB + ' KB)');
