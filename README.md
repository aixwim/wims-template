# wims-template

Tema sumber untuk seluruh situs jaringan **Wim** (Next.js static blog, dark-only, config-driven).

Repo ini adalah **sumber kode tema** — identitas tiap situs hidup di `site.config.json` masing-masing,
bukan di kode. Perbaikan tema dilakukan di repo ini, lalu disebar ke semua situs lewat
`scripts/sync-theme.sh` (lihat [wims-docs/docs/05-SYNC.md](https://github.com/aixwim/wims-docs/blob/main/docs/05-SYNC.md)).

## Struktur

```
wims-template/
├── site.config.json.example   # contoh konfigurasi situs
├── site.config.json           # konfigurasi template (default)
├── src/                       # seluruh kode tema (server + client)
├── public/                    # aset statis (giscus theme, security.txt)
├── registry/network.json      # daftar kanonik semua situs jaringan
├── scripts/generate-assets.mjs# generate og.png + favicon dari brand
├── content/                   # placeholder post (hapus saat dipakai)
└── .github/workflows/deploy.yml
```

## Memulai Situs Baru

1. `gh repo create <nama-repo> --public --clone` (atau buat via GitHub UI).
2. Salin isi repo ini (tanpa `.git`) ke repo situs.
3. Edit `site.config.json`:
   - `repo` → nama repo (basePath otomatis `/<repo>`)
   - `brand.accent` / `brand.accent2` → palette niche (wajib hex)
   - `siteName`, `logoText`, `tagline`, `description`, `category`, `parent`, `children`, `related`
   - `giscus` → repo-id & category-id dari repo situs (opsional)
4. `npm install`
5. `npm run assets` → generate `public/og.png` + `public/favicon.svg` dari brand
6. Hapus `content/selamat-datang.md`, tambahkan artikelmu di `content/`
7. `npm run build` → `npm run lint` → commit → push (GH Pages auto-deploy)

## Script

| Command | Fungsi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build static ke `out/` |
| `npm run lint` | ESLint |
| `npm run assets` | Generate og.png + favicon dari `site.config.json` |

## Catatan

- Warna brand diikat lewat CSS vars `--brand-accent` / `--brand-accent2` (di-inject di `<html>`).
  Jangan hardcode `indigo/violet/cyan` untuk elemen brand baru.
- Semua warna tema wajib **hex** (lihat [09-TROUBLESHOOTING](https://github.com/aixwim/wims-docs/blob/main/docs/09-TROUBLESHOOTING.md)).
- Footer blok "Jaringan Wim" otomatis dibaca dari `registry/network.json`.
