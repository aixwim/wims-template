#!/usr/bin/env node
/**
 * sync-theme.mjs — Sinkronkan tema dari wims-template ke repo situs.
 *
 * Menyalin hanya file yang berbeda (hash-compare) dari daftar sinkron.
 * TIDAK PERNAH menyentuh: site.config.json, content/**, public/og.png,
 * public/favicon.svg, out/, node_modules, .git.
 *
 * Usage:
 *   node scripts/sync-theme.mjs --template /path/to/wims-template --site .
 *   node scripts/sync-theme.mjs --template /tmp/template --site . --check
 *
 * --check : hanya tampilkan perbedaan, tanpa menyalin (exit 1 bila ada beda).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const templateDir = path.resolve(flag('--template') || '');
const siteDir = path.resolve(flag('--site') || '.');
const checkOnly = args.includes('--check');

if (!templateDir || !fs.existsSync(templateDir)) {
  console.error('--template wajib berupa direktori yang ada');
  process.exit(2);
}
if (!fs.existsSync(siteDir)) {
  console.error(`--site tidak ada: ${siteDir}`);
  process.exit(2);
}

const SYNC_PATHS = [
  'src',
  'next.config.js',
  'package.json',
  'eslint.config.mjs',
  'postcss.config.mjs',
  'tsconfig.json',
  'next-env.d.ts',
  '.gitignore',
  '.pages.yml',
  '.github/workflows/deploy.yml',
  '.github/workflows/pages-cms-media.yml',
  'scripts',
  'public',
  'registry/network.json',
];

const NEVER_SYNC = new Set([
  'site.config.json',
  'site.config.json.example',
  'content',
  'out',
  'node_modules',
  '.git',
  'public/og.png',
  'public/favicon.svg',
  'registry',
  'src/app/page.tsx',
  'src/lib/network.ts',
]);

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function collect(dir, base, prefix) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const rel = path.join(prefix, entry.name);
    if (NEVER_SYNC.has(rel) || NEVER_SYNC.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collect(abs, base, rel));
    else out.push(rel);
  }
  return out;
}

function normalizeName(rel) {
  return path.sep === '\\' ? rel.replace(/\\/g, '/') : rel;
}

// daftar file yang disinkron dari template
const syncedFiles = [];
for (const p of SYNC_PATHS) {
  const abs = path.join(templateDir, p);
  if (!fs.existsSync(abs)) continue;
  if (fs.statSync(abs).isDirectory()) {
    syncedFiles.push(...collect(abs, templateDir, p).map(normalizeName));
  } else {
    syncedFiles.push(normalizeName(p));
  }
}

const changed = [];
for (const rel of syncedFiles) {
  const src = path.join(templateDir, rel);
  const dst = path.join(siteDir, rel);
  if (NEVER_SYNC.has(rel) || NEVER_SYNC.has(path.basename(rel))) continue;
  if (!fs.existsSync(src)) continue;

  if (fs.existsSync(dst) && hashFile(src) === hashFile(dst)) continue;

  changed.push(rel);
  if (!checkOnly) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

if (checkOnly) {
  if (changed.length) {
    console.error(`${changed.length} file berbeda dari template:`);
    changed.forEach((c) => console.error(`  - ${c}`));
    process.exit(1);
  }
  console.log('✓ sudah sinkron dengan template');
  process.exit(0);
}

if (changed.length) {
  console.log(`Disinkronkan ${changed.length} file:`);
  changed.forEach((c) => console.log(`  - ${c}`));
} else {
  console.log('✓ sudah sinkron dengan template (tidak ada perubahan)');
}