import type { MetadataRoute } from 'next';
import { getSiteConfig, basePath } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  const site = getSiteConfig();

  return {
    name: `${site.siteName} — ${site.tagline}`,
    short_name: site.siteName,
    description: site.description,
    start_url: basePath + '/',
    scope: basePath + '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: site.brand.accent,
    orientation: 'portrait-primary',
    icons: [
      {
        src: basePath + '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    categories: ['technology', 'education', 'productivity'],
    lang: 'id',
    dir: 'ltr',
  };
}
