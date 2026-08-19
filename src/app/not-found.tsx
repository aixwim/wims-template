import Link from 'next/link';
import type { Metadata } from 'next';
import { href } from '@/lib/url';
import { getSiteConfig } from '@/lib/site';

const site = getSiteConfig();

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: `Halaman yang kamu cari tidak ditemukan di ${site.siteName}. Kembali ke beranda atau jelajahi artikel lainnya.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="max-w-screen-md mx-auto py-20 text-center">
      <p className="text-gradient text-7xl font-extrabold tracking-tight mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Halaman tidak ditemukan</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={href('/')} prefetch={false} className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path d="M3 12l9-9 9 9M5 10v10h14V10" /></svg>
          Kembali ke Beranda
        </Link>
        <Link href={href('/posts/')} prefetch={false} className="btn btn-secondary">
          Lihat Artikel
        </Link>
      </div>
    </section>
  );
}