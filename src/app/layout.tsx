import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { href } from '@/lib/url';
import { siteUrl, basePath, absoluteUrl, getSiteConfig } from '@/lib/site';
import { getNetwork } from '@/lib/network';

const site = getSiteConfig();
const siteName = site.siteName;
const description = site.description;
const network = getNetwork();
const networkSites = [...network.sites, ...network.topics];
const isHub = network.hub === site.repo;

const categoryKeywords: Record<string, string[]> = {
  Hub: ['jaringan konten indonesia', 'portal blog indonesia', 'kumpulan blog', 'blog bahasa indonesia', 'konten digital'],
  Berita: ['berita indonesia', 'informasi terpercaya', 'jurnalisme', 'literasi media', 'fakta checking'],
  Bisnis: ['bisnis indonesia', 'wirausaha', 'umkm', 'strategi bisnis', 'marketing digital'],
  Entertainment: ['hiburan indonesia', 'film indonesia', 'musik indonesia', 'konser', 'streaming'],
  Game: ['game indonesia', 'esports', 'game mobile', 'gaming', 'komunitas game'],
  Kultur: ['budaya indonesia', 'tradisi nusantara', 'warisan budaya', 'seni tradisional', 'kearifan lokal'],
  Living: ['desain interior', 'rumah minimalis', 'gaya hidup', 'berkebun di rumah', 'hemat energi'],
  Olahraga: ['olahraga indonesia', 'sepak bola', 'kebugaran', 'lari', 'gaya hidup sehat'],
  Selebritas: ['selebritas indonesia', 'hiburan', 'artis', 'fandom', 'dunia selebriti'],
  Style: ['fashion indonesia', 'gaya berpakaian', 'streetwear', 'perawatan kulit', 'tren fashion'],
  Teknologi: ['teknologi indonesia', 'web development', 'seo blog', 'tutorial coding', 'kecerdasan buatan'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: site.brand.accent,
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl + basePath),
  title: {
    default: `${siteName} — ${site.tagline}`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    site.categoryLabel.toLowerCase(),
    ...(categoryKeywords[site.categoryLabel] || []),
    'blog',
    'aixwim',
    siteName.toLowerCase(),
  ],
  authors: [{ name: 'aixwim', url: absoluteUrl('/about/') }],
  creator: 'aixwim',
  publisher: 'aixwim',
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName,
    locale: 'id_ID',
    url: absoluteUrl('/'),
    title: `${siteName} — ${site.tagline}`,
    description,
    images: [
      {
        url: absoluteUrl('/og.png'),
        width: 1200,
        height: 630,
        alt: `${siteName} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — ${site.tagline}`,
    description,
    images: [absoluteUrl('/og.png')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  ...(site.googleVerification ? { verification: { google: site.googleVerification } } : {}),
  alternates: {
    types: {
      'application/rss+xml': [{ title: siteName, url: href('/rss.xml') }],
    },
  },
  icons: {
    icon: [
      { url: basePath + '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: basePath + '/favicon.svg', sizes: '180x180' }],
  },
  manifest: basePath + '/manifest.webmanifest',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  alternateName: `${siteName} Blog`,
  url: absoluteUrl('/'),
  description,
  inLanguage: 'id-ID',
  publisher: {
    '@type': 'Person',
    name: 'aixwim',
    url: absoluteUrl('/about/'),
    email: 'mailto:hello@aixwim.dev',
    sameAs: ['https://github.com/aixwim'],
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: absoluteUrl('/search/') + '?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const networkJsonLd = isHub
  ? {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Jaringan Wim',
      url: absoluteUrl('/'),
      description,
      knowsAbout: networkSites.map((s) => s.name),
      member: networkSites
        .filter((s) => s.repo !== site.repo && s.status !== 'planned')
        .map((s) => ({
          '@type': 'WebSite',
          name: s.name,
          url: `${siteUrl}/${s.repo}/`,
        })),
    }
  : null;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className="dark"
      suppressHydrationWarning
      data-brand-accent={site.brand.accent}
      data-brand-accent2={site.brand.accent2}
      data-logo-text={site.logoText}
      data-logo-prefix={site.logoPrefix ?? ''}
      style={{
        ['--brand-accent' as string]: site.brand.accent,
        ['--brand-accent2' as string]: site.brand.accent2,
      }}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {networkJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(networkJsonLd) }} />}
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-300 antialiased flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-brand text-white px-4 py-2 rounded-md">
          Lewati ke konten
        </a>
        <Header
          logoText={site.logoText}
          logoPrefix={site.logoPrefix ?? ''}
        />
        <main id="main-content" className="flex-1 w-full mx-auto max-w-screen-lg px-5 py-6 lg:px-8 lg:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}