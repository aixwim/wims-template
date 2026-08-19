import fs from 'fs';
import path from 'path';

export interface SiteConfig {
  repo: string;
  siteName: string;
  logoText: string;
  logoPrefix?: string;
  tagline: string;
  description: string;
  category: string;
  categoryLabel: string;
  parent: string | null;
  children: string[];
  related: string[];
  brand: { accent: string; accent2: string };
  giscus?: { repoId: string; categoryId: string };
  googleVerification?: string;
}

export const siteUrl = 'https://aixwim.github.io';

let _config: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (_config) return _config;
  const file = path.join(process.cwd(), 'site.config.json');
  _config = JSON.parse(fs.readFileSync(file, 'utf-8')) as SiteConfig;
  return _config;
}

export const basePath = '/' + getSiteConfig().repo;
export const canonicalUrl = (p: string) => siteUrl + basePath + p;
export const absoluteUrl = (p: string) => siteUrl + basePath + p;
