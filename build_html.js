/**
 * build_html.js — Bundle Script for Offline Standalone Website
 *
 * SOURCE OF TRUTH:
 *   - HTML & UI: index.html
 *   - Logic:     js/app.js
 *   - Storage:   js/storage.js
 *   - Questions: data/subjects.json, data/subjects/*.json
 *
 * This script reads index.html and produces PoF-QuestionBank-website.html,
 * a fully self-contained single-file bundle that embeds all subjects, questions,
 * and JS code inline so it can be opened offline via file:// without CORS issues.
 *
 * What it does NOT do (intentionally):
 *   - Does NOT modify index.html
 *   - Does NOT contain hardcoded HTML templates
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

// Load subjects manifest and question data
const subjectsFile = path.join(ROOT, 'data', 'subjects.json');
const subjects = JSON.parse(fs.readFileSync(subjectsFile, 'utf8'));

const embeddedData = {};
for (const s of subjects) {
  const qFilePath = path.join(ROOT, s.file);
  if (fs.existsSync(qFilePath)) {
    embeddedData[s.id] = JSON.parse(fs.readFileSync(qFilePath, 'utf8'));
  }
}

// Load storage.js and app.js
const storageJs = fs.readFileSync(path.join(ROOT, 'js', 'storage.js'), 'utf8');
const appJs     = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');

// Replace external script tags with inlined embedded data and scripts
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

console.log('Built standalone offline bundle successfully!');
console.log('  Source : index.html                     (' + srcKB + ' KB)');
console.log('  Output : PoF-QuestionBank-website.html  (' + outKB + ' KB)');
