#!/usr/bin/env node
/**
 * check-links.js — Validasi graf jaringan Wim + link internal build.
 *
 * Mode 1 (graf, wajib): membaca registry/network.json, memvalidasi
 *   parent/children/related (tidak ada referensi ke repo tak dikenal,
 *   tidak ada self-link, hub terjangkau <= 2 hop dari semua situs).
 *
 * Mode 2 (build, opsional): bila direktori `out/` ada di cwd, memindai
 *   seluruh HTML hasil build dan memvalidasi:
 *   - link internal menunjuk ke file yang benar-benar ada (0 broken)
 *   - link keluar ke repo jaringan memakai repo yang dikenal network.json
 *
 * Usage:
 *   node scripts/check-links.js [--registry path/to/network.json] [--out path]
 *
 * Exit code 0 bila bersih, 1 bila ada broken/orphan/graph invalid.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const registryPath =
  flag('--registry') ||
  path.resolve(process.cwd(), 'registry', 'network.json');
const outDir = flag('--out') || path.resolve(process.cwd(), 'out');

// basePath otomatis dari site.config.json bila ada di cwd
const siteConfigPath = path.resolve(process.cwd(), 'site.config.json');
const basePath = flag('--basePath') || (() => {
  if (fs.existsSync(siteConfigPath)) {
    const cfg = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8'));
    if (cfg.repo) return '/' + cfg.repo;
  }
  return '/';
})();

const SITE_HOST = 'aixwim.github.io';

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function loadNetwork(file) {
  if (!fs.existsSync(file)) {
    console.error(`registry tidak ditemukan: ${file}`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

// ---------- Mode 1: graf ----------
function checkGraph(network) {
  const all = [...(network.sites || []), ...(network.topics || [])];
  const byRepo = new Map(all.map((s) => [s.repo, s]));
  const hubRepo = network.hub;

  if (!byRepo.has(hubRepo)) fail(`hub "${hubRepo}" tidak ada di daftar situs`);

  for (const site of all) {
    const refs = [
      ...(site.parent ? [site.parent] : []),
      ...(site.children || []),
      ...(site.related || []),
    ];
    for (const ref of refs) {
      if (ref === site.repo) {
        fail(`${site.repo}: self-link pada parent/children/related`);
      }
      if (!byRepo.has(ref)) {
        fail(`${site.repo}: referensi ke repo tak dikenal "${ref}"`);
      }
    }
    const uniq = new Set(refs);
    if (uniq.size !== refs.length) {
      fail(`${site.repo}: referensi duplikat ${JSON.stringify(refs)}`);
    }
  }

  // BFS dari hub — semua node harus terjangkau <= 2 hop
  const adj = new Map(all.map((s) => [s.repo, new Set()]));
  for (const site of all) {
    for (const ref of [
      ...(site.parent ? [site.parent] : []),
      ...(site.children || []),
      ...(site.related || []),
    ]) {
      if (byRepo.has(ref)) {
        adj.get(site.repo).add(ref);
        adj.get(ref).add(site.repo);
      }
    }
  }

  const dist = new Map([[hubRepo, 0]]);
  const queue = [hubRepo];
  while (queue.length) {
    const cur = queue.shift();
    for (const nb of adj.get(cur) || []) {
      if (!dist.has(nb)) {
        dist.set(nb, dist.get(cur) + 1);
        queue.push(nb);
      }
    }
  }

  for (const site of all) {
    if (!dist.has(site.repo)) {
      fail(`${site.repo}: terisolasi — tidak terhubung ke hub`);
    } else if (dist.get(site.repo) > 2) {
      fail(`${site.repo}: jarak ke hub ${dist.get(site.repo)} hop (> 2)`);
    }
  }

  // Laporan per-repo
  console.log('\nGraf jaringan (link out / in):');
  for (const site of all) {
    const out =
      (site.parent ? 1 : 0) + (site.children || []).length + (site.related || []).length;
    console.log(`  ${site.repo.padEnd(22)} out=${out}  (parent=${site.parent ?? '-'} children=${(site.children || []).length} related=${(site.related || []).length})`);
  }
}

// ---------- Mode 2: build ----------
function walkHtml(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkHtml(p));
    else if (entry.name.endsWith('.html')) results.push(p);
  }
  return results;
}

function checkBuild(outDir, network) {
  const all = [...(network.sites || []), ...(network.topics || [])];
  const repos = new Set(all.map((s) => s.repo));
  const files = walkHtml(outDir);
  if (!files.length) {
    warn(`tidak ada HTML di ${outDir} — mode build dilewati`);
    return;
  }
  console.log(`\nMemindai ${files.length} halaman build...`);

  const hrefRe = /(?:href|src)="([^"]+)"/g;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf-8');
    let m;
    while ((m = hrefRe.exec(html))) {
      let href = m[1];
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('data:') ||
          href.startsWith('javascript:')) continue;

      // Link keluar ke repo jaringan: hanya host situs jaringan
      if (href.includes(SITE_HOST)) {
        const netMatch = href.match(new RegExp(`^https?://${SITE_HOST}/([a-z0-9-]+)`));
        if (netMatch) {
          const target = netMatch[1];
          if (target !== network.hub && !repos.has(target)) {
            fail(`broken network link: ${href} (di ${path.relative(process.cwd(), file)})`);
          }
          continue; // link lintas situs — cukup dicek via network.json
        }
      }

      // Link internal (relatif atau absolut dengan basePath) harus ada di out/
      if (!/^https?:|^\/\//.test(href)) {
        let target;
        if (href.startsWith('/')) {
          target = href.startsWith(basePath)
            ? path.join(outDir, href.slice(basePath.length))
            : path.join(outDir, href.slice(1));
        } else {
          target = path.join(path.dirname(file), href);
        }
        if (href.includes('?')) target = target.split('?')[0];
        if (href.includes('#')) target = target.split('#')[0];
        target = decodeURIComponent(target);
        const exists =
          fs.existsSync(target) ||
          (target.endsWith('/') && fs.existsSync(path.join(target, 'index.html')));
        if (!exists) {
          fail(`broken internal link: ${href} (di ${path.relative(process.cwd(), file)})`);
        }
      }
    }
  }
}

// ---------- main ----------
const network = loadNetwork(registryPath);
console.log(`Registry: ${registryPath}`);
console.log(`Hub: ${network.hub} | ${(network.sites || []).length} situs + ${(network.topics || []).length} topik`);

checkGraph(network);
checkBuild(outDir, network);

console.log('');
if (errors.length) {
  console.error(`✗ ${errors.length} error:`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exitCode = 1;
} else {
  console.log('✓ graf valid, 0 broken link');
}
if (warnings.length) {
  console.warn(`! ${warnings.length} peringatan:`);
  warnings.forEach((w) => console.warn(`  - ${w}`));
}