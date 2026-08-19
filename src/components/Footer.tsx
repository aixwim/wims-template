import Link from 'next/link';
import { href, tagHref } from '@/lib/url';
import Logo from './Logo';
import { getAllTags } from '@/lib/posts';
import { getSiteConfig } from '@/lib/site';
import { siteUrl } from '@/lib/site';
import { getNetworkLinks, getAllRepos } from '@/lib/network';

export default function Footer() {
  const site = getSiteConfig();
  const tags = getAllTags().slice(0, 8);
  const networkLinks = getNetworkLinks(site.repo);
  const allRepos = getAllRepos();

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-16 bg-gray-50/60 dark:bg-gray-950/60">
      <div className="mx-auto max-w-screen-lg px-5 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo logoText={site.logoText} logoPrefix={site.logoPrefix ?? ''} />
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {site.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/aixwim"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0022 12.25C22 6.58 17.52 2 12 2z" />
                </svg>
              </a>
              <a
                href="mailto:hello@aixwim.dev"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" />
                </svg>
              </a>
              <a
                href={href('/rss.xml')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                aria-label="RSS Feed"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9zM6.18 15.64a2.18 2.18 0 110 4.36 2.18 2.18 0 010-4.36z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigasi footer">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Navigasi</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: href('/'), label: 'Beranda' },
                { href: href('/posts/'), label: 'Semua Artikel' },
                { href: href('/tags/'), label: 'Tags' },
                { href: href('/about/'), label: 'Tentang' },
                { href: href('/contact/'), label: 'Kontak' },
                { href: href('/search/'), label: 'Cari' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} prefetch={false} className="text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular topics */}
          <nav aria-label="Topik populer">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Topik Populer</h3>
            <ul className="space-y-2.5 text-sm">
              {tags.map(({ tag, count }) => (
                <li key={tag}>
                  <Link href={tagHref(tag)} prefetch={false} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand transition-colors">
                    <span>{tag}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Network */}
          <nav aria-label="Jaringan Wim">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Jaringan Wim</h3>
            <ul className="space-y-2.5 text-sm">
              {networkLinks.map((s) => (
                <li key={s.repo}>
                  <Link href={`${siteUrl}/${s.repo}/`} prefetch={false} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand dark:text-gray-400 dark:hover:text-brand transition-colors">
                    <span>{s.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({s.categoryLabel})</span>
                  </Link>
                </li>
              ))}
              {networkLinks.length === 0 && (
                <li className="text-sm text-gray-500 dark:text-gray-400">Bagian dari jaringan situs Wim.</li>
              )}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-center sm:text-left">
          <p className="text-sm text-gray-600 dark:text-gray-500">
            {new Date().getFullYear()} {site.siteName} · Dikelola oleh aixwim · {allRepos.length} situs
          </p>
        </div>
      </div>
    </footer>
  );
}