#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const chunksDir = join(root, 'out', '_next', 'static', 'chunks');

if (!exists(chunksDir)) {
  console.log('cleanup-chunks: out/_next/static/chunks tidak ada, skip.');
  process.exit(0);
}

function exists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

function walk(d, base, out = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(p);
  }
  return out;
}

const files = walk(chunksDir, chunksDir);

const refs = new Set();
const re = /\/_next\/static\/chunks\/[^"'\s<>\\]*\.(?:js|css)/g;
for (const f of walk(join(root, 'out'), join(root, 'out'))) {
  if (f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.txt')) {
    const c = readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(c))) refs.add(m[0].replace('/_next/static/chunks/', ''));
  }
}

let removed = 0;
let bytes = 0;
for (const f of files) {
  const rel = f.replace(chunksDir + '/', '');
  const enc = rel.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
  if (refs.has(rel) || refs.has(enc)) continue;
  bytes += statSync(f).size;
  unlinkSync(f);
  removed++;
  console.log('  hapus:', rel);
}

function rmEmptyDirs(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) {
      const p = join(d, e.name);
      rmEmptyDirs(p);
      if (readdirSync(p).length === 0) rmdirSync(p);
    }
  }
}
rmEmptyDirs(chunksDir);

console.log(`cleanup-chunks: ${removed} file dihapus (${(bytes / 1024).toFixed(0)} kB).`);