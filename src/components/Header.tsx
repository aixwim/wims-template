import Link from 'next/link';
import { href } from '@/lib/url';
import Logo from './Logo';

const navLinks = [
  { href: href('/'), label: 'Home' },
  { href: href('/posts/'), label: 'Archive' },
  { href: href('/tags/'), label: 'Tags' },
  { href: href('/about/'), label: 'About' },
  { href: href('/contact/'), label: 'Contact' },
];

export default function Header({ logoText, logoPrefix }: { logoText: string; logoPrefix: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-screen-lg px-5 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo logoText={logoText} logoPrefix={logoPrefix} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Navigasi utama">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href={href('/search/')}
              prefetch={false}
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              aria-label="Cari artikel"
              title="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </Link>

            {/* Mobile menu (native details, no JS) */}
            <details className="group md:hidden relative">
              <summary
                className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl text-gray-300 transition-colors hover:bg-gray-800 [&::-webkit-details-marker]:hidden"
                aria-label="Buka menu"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/95 shadow-2xl backdrop-blur-md">
                <nav aria-label="Navigasi menu mobile" className="p-2">
                  <Link
                    href={href('/search/')}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-gray-400" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    Search
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}