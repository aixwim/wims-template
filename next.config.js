/** @type {import('next').NextConfig} */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = JSON.parse(readFileSync(join(__dirname, 'site.config.json'), 'utf-8'));

const nextConfig = {
  output: 'export',
  basePath: '/' + config.repo,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;