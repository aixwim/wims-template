import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let puppeteer;
try {
  puppeteer = (await import('puppeteer-core')).default;
} catch {
  puppeteer = (await import('/tmp/opencode/node_modules/puppeteer-core/lib/cjs/puppeteer/puppeteer-core.js')).default;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const site = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf-8'));

const accent = site.brand.accent;
const accent2 = site.brand.accent2;
const logoText = site.logoText;
const logoPrefix = site.logoPrefix ?? '';

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${accent2}"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#g)"/>
  <path d="M16 5l2.2 6.6H25l-5.5 4 2.1 6.6L16 18.2l-5.6 4 2.1-6.6-5.5-4h6.8z" fill="#ffffff"/>
</svg>`;

writeFileSync(join(root, 'public', 'favicon.svg'), favicon);
console.log('favicon.svg generated:', accent, '->', accent2);

const ogHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #0f172a 45%, #1e293b 100%);
    position: relative; overflow: hidden;
    display: flex; align-items: center;
  }
  .glow1 { position: absolute; width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, ${accent}99, transparent 65%); top: -160px; right: -120px; }
  .glow2 { position: absolute; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, ${accent2}66, transparent 65%); bottom: -180px; left: -100px; }
  .glow3 { position: absolute; width: 380px; height: 380px; border-radius: 50%; background: radial-gradient(circle, ${accent}66, transparent 65%); top: 40%; left: 55%; }
  .content { position: relative; z-index: 2; padding: 70px 80px; max-width: 900px; }
  .logo { display: inline-flex; align-items: center; gap: 14px; margin-bottom: 34px; }
  .logo-mark {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, ${accent}, ${accent2});
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px ${accent}80;
  }
  .logo-mark svg { width: 28px; height: 28px; fill: #fff; }
  .logo-text { color: #fff; font-size: 30px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-text span { background: linear-gradient(135deg, ${accent}, ${accent2}); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${accent}33; border: 1px solid ${accent}66;
    color: #cbd5e1; padding: 8px 16px; border-radius: 999px;
    font-size: 16px; font-weight: 600; margin-bottom: 22px;
  }
  .badge .dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; }
  h1 {
    color: #fff; font-size: 58px; font-weight: 800; line-height: 1.15; letter-spacing: -1.5px;
    margin-bottom: 20px;
  }
  h1 .grad { background: linear-gradient(135deg, ${accent}, ${accent2} 45%, ${accent2}); -webkit-background-clip: text; background-clip: text; color: transparent; }
  p { color: #cbd5e1; font-size: 22px; line-height: 1.6; max-width: 640px; }
</style>
</head>
<body>
  <div class="glow1"></div>
  <div class="glow2"></div>
  <div class="glow3"></div>
  <div class="content">
    <div class="logo">
      <div class="logo-mark">
        <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 16.5 5.8 21l2.4-7.3L2 9.2h7.6z"/></svg>
      </div>
      <div class="logo-text">${logoPrefix}<span>${logoText}</span></div>
    </div>
    <div class="badge"><span class="dot"></span> ${site.tagline}</div>
    <h1>${site.ogTitle}</h1>
    <p>${site.ogSubtitle}</p>
  </div>
</body>
</html>`;

mkdirSync(join(root, 'public'), { recursive: true });
const tmp = join('/tmp', 'og-' + site.repo + '.html');
writeFileSync(tmp, ogHtml);

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto('file://' + tmp, { waitUntil: 'networkidle0' });
await page.screenshot({ path: join(root, 'public', 'og.png'), type: 'png' });
await browser.close();
console.log('og.png generated');
