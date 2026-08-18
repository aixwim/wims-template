import { getAllPosts } from '@/lib/posts';
import SearchInner from '@/components/SearchInner';
import type { Metadata } from 'next';
import { canonicalUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cari Artikel',
  description: 'Cari dan temukan artikel tentang web development, SEO, teknologi, dan tips di blog aixwim.',
  alternates: { canonical: canonicalUrl('/search/') },
};

export default function SearchPage() {
  const posts = getAllPosts();
  const searchIndex = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags,
    date: p.date,
  }));

  return (
    <section className="max-w-screen-md mx-auto">
      <header className="mb-8">
        <span className="badge bg-brand/15 text-brand mb-4">Pencarian</span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Cari Artikel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ketik kata kunci untuk menemukan artikel yang kamu butuhkan.
        </p>
      </header>
      <SearchInner searchIndex={searchIndex} />
    </section>
  );
}