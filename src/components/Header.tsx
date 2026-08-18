'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { href } from '@/lib/url';
import Logo from './Logo';

const navLinks = [
  { href: href('/'), label: 'Home' },
  { href: href('/posts/'), label: 'Archive' },
  { href: href('/tags/'), label: 'Tags' },
  { href: href('/about/'), label: 'About' },
  { href: href('/contact/'), label: 'Contact' },
];

export default function Header({ siteName, logoText, logoPrefix }: { siteName: string; logoText: string; logoPrefix: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const onScroll = () => {
      const el = headerRef.current;
      if (!el) return;
      const scrolled = window.scrollY > 10;
      el.classList.toggle('is-scrolled', scrolled);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b transition-all duration-300 border-transparent bg-gray-950/60 backdrop-blur-sm is-scrolled:border-gray-800 is-scrolled:bg-gray-950/85 is-scrolled:backdrop-blur-md"
    >
      <div className="mx-auto max-w-screen-lg px-5 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo siteName={siteName} logoText={logoText} logoPrefix={logoPrefix} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Navigasi utama">
            {navLinks.map((link) => {
              const active = link.href === href('/') ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2 transition-colors ${
                    active
                      ? 'bg-brand/30 text-brand'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
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

            {/* Mobile hamburger */}
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav id="mobile-nav" className="md:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-md">
          <div className="mx-auto max-w-screen-lg px-5 py-3 space-y-1">
            <Link
              href={href('/search/')}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800"
              onClick={() => setMobileOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-gray-400" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
              </svg>
              Search
            </Link>
            {navLinks.map((link) => {
              const active = link.href === href('/') ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand/30 text-brand'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}