/**
 * build_html.js - Bundle Script
 *
 * SOURCE OF TRUTH: index.html  (edit this file directly for all changes)
 *
 * This script reads index.html and produces PoF-QuestionBank-website.html,
 * a fully self-contained single-file mirror for offline / file:// access.
 *
 * What it does:
 *   1. Reads index.html as-is (no modification)
 *   2. Writes it verbatim to PoF-QuestionBank-website.html
 *
 * What it does NOT do (intentionally):
 *   - Does NOT modify index.html
 *   - Does NOT contain its own HTML template
 *   - Does NOT regenerate / overwrite index.html
 *
 * Usage:
 *   node build_html.js
 *
 * Workflow:
 *   Edit index.html  =>  node build_html.js  =>  PoF-QuestionBank-website.html
 *
 * NEVER modify index.html through this script.
 * Always edit index.html directly, then run this script.
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

const html = fs.readFileSync(SOURCE, 'utf8');
fs.writeFileSync(SINGLE_FILE, html, 'utf8');

const srcKB  = (fs.statSync(SOURCE).size      / 1024).toFixed(1);
const outKB  = (fs.statSync(SINGLE_FILE).size / 1024).toFixed(1);

console.log('Built successfully!');
console.log('  Source : index.html                     (' + srcKB + ' KB)');
console.log('  Output : PoF-QuestionBank-website.html  (' + outKB + ' KB)');
console.log('');
console.log('To make changes: edit index.html directly, then run this script again.');
