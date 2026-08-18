import Link from 'next/link';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { href } from '@/lib/url';
import { canonicalUrl, absoluteUrl } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arsip Artikel',
  description: 'Semua artikel di blog aixwim tentang teknologi, web development, SEO, dan tips.',
  alternates: { canonical: canonicalUrl('/posts/') },
};

export default function PostsPage() {
  const posts = getAllPosts();
  const tags = getAllTags().slice(0, 8);
  const years = [...new Set(posts.map((p) => p.date.getFullYear()))].sort((a, b) => b - a);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Semua Artikel',
    url: absoluteUrl('/posts/'),
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 20).map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: post.title,
      url: absoluteUrl(`/posts/${post.slug}/`),
      datePublished: post.date.toISOString(),
    })),
  };

  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      {/* Header */}
      <header className="mb-10">
        <span className="badge bg-brand/15 text-brand mb-4">Arsip</span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Semua Artikel
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
          {posts.length} artikel yang ditulis untuk berbagi pengetahuan tentang teknologi dan pengembangan web.
        </p>
      </header>

      {/* Quick tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={href(`/tags/${tag}/`)}
            prefetch={false}
            className="badge bg-gray-100 text-gray-700 hover:bg-brand/20 hover:text-brand dark:bg-gray-800 dark:text-gray-300 transition-colors"
          >
            {tag}
            <span className="text-xs text-gray-600 dark:text-gray-500">{count}</span>
          </Link>
        ))}
      </div>

      {/* Posts grouped by year */}
      {years.map((year) => {
        const yearPosts = posts.filter((p) => p.date.getFullYear() === year);
        return (
          <div key={year} className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-500 mb-6">
              {year}
            </h2>
            <div className="space-y-2">
              {yearPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={href(`/posts/${post.slug}/`)}
                  prefetch={false}
                  className={`group flex items-baseline gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 ${i !== yearPosts.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
                >
                  <time className="text-xs text-gray-600 dark:text-gray-500 tabular-nums shrink-0 w-20 hidden sm:block" dateTime={post.date.toISOString()}>
                    {post.date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </time>
                  <span className="text-[15px] font-semibold text-gray-800 dark:text-gray-200 group-hover:text-brand transition-colors leading-snug">
                    {post.title}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 ml-auto text-gray-300 dark:text-gray-600 group-hover:text-brand group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}