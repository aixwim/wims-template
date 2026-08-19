import type { Metadata } from 'next';
import Link from 'next/link';
import { canonicalUrl, absoluteUrl, getSiteConfig } from '@/lib/site';
import { href } from '@/lib/url';
import { getAllPosts } from '@/lib/posts';

const site = getSiteConfig();

export const metadata: Metadata = {
  title: 'Tentang',
  description: `Tentang ${site.siteName} — ${site.tagline}. Kenali siapa di balik situs ini dan mengapa ${site.siteName.toLowerCase()} menghadirkan konten berkualitas untuk pembaca Indonesia.`,
  alternates: { canonical: canonicalUrl('/about/') },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'aixwim',
  url: absoluteUrl('/about/'),
  jobTitle: 'Web Developer',
  knowsAbout: ['Web Development', 'SEO', 'JavaScript', 'Next.js'],
  sameAs: ['https://github.com/aixwim'],
};

export default function AboutPage() {
  const postCount = getAllPosts().length;

  return (
    <section className="max-w-screen-md mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-10 text-center">
        <span className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-brand via-brand2 to-brand2 items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-brand/30 mb-5">
          a
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Halo, saya <span className="text-gradient">aixwim</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Web developer yang suka berbagi ilmu lewat tulisan.
        </p>
      </header>

      <div className="prose max-w-none">
        <p>
          Selamat datang di blog saya! Saya seorang pengembang web yang tertarik dengan teknologi, sumber terbuka, dan pembelajaran berkelanjutan.
        </p>
        <p>
          Blog ini lahir dari keinginan untuk mendokumentasikan apa yang saya pelajari. Dari pengembangan web, SEO, sampai tips produktivitas — semua saya tulis dengan bahasa yang mudah dipahami, agar siapa pun bisa ikut belajar.
        </p>
        <p>
          Sampai saat ini saya sudah menulis <strong>{postCount} artikel</strong>. Terima kasih sudah mampir!
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />, title: 'Menulis', desc: 'Artikel mendalam dan mudah dipahami' },
          { icon: <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />, title: 'Belajar', desc: 'Terus memperbarui ilmu teknologi' },
          { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />, title: 'Berkarya', desc: 'Membangun web yang cepat & ringan' },
        ].map((f) => (
          <div key={f.title} className="card card-hover p-5 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 mx-auto text-brand mb-3" aria-hidden="true">
              {f.icon}
            </svg>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href={href('/posts/')} prefetch={false} className="btn btn-primary">
          Baca Artikel Saya
        </Link>
      </div>
    </section>
  );
}