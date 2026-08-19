import Link from 'next/link';
import { getAllTags } from '@/lib/posts';
import { tagHref } from '@/lib/url';
import { canonicalUrl, absoluteUrl } from '@/lib/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar Topik',
  description: 'Jelajahi semua topik dan tag untuk menemukan artikel favoritmu di blog ini.',
  alternates: { canonical: canonicalUrl('/tags/') },
};

export default function TagsPage() {
  const tags = getAllTags();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Semua Tag',
    url: absoluteUrl('/tags/'),
    numberOfItems: tags.length,
    itemListElement: tags.map(({ tag }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${tag}`,
      url: absoluteUrl(tagHref(tag)),
    })),
  };

  return (
    <section className="max-w-screen-md">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <header className="mb-10">
        <span className="badge bg-brand/15 text-brand mb-4">Topik</span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Jelajahi Tag
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
          Temukan artikel berdasarkan topik yang kamu minati.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {tags.map(({ tag, count }, i) => {
          const gradients = [
            'from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20',
            'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
            'from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20',
            'from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20',
          ];
          const textColors = [
            'text-brand',
            'text-cyan-600 dark:text-cyan-300',
            'text-emerald-600 dark:text-emerald-300',
            'text-violet-600 dark:text-violet-300',
          ];
          return (
            <Link
              key={tag}
              href={tagHref(tag)}
              prefetch={false}
              className={`group flex items-center justify-between rounded-2xl bg-gradient-to-br ${gradients[i % 4]} border border-gray-100 dark:border-gray-800 px-5 py-4 hover:shadow-lg hover:-translate-y-0.5 transition-all`}
            >
              <span className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${gradients[i % 4].split(' ')[0]} group-hover:scale-125 transition-transform`} aria-hidden="true" />
                <span className={`font-bold ${textColors[i % 4]}`}>{tag}</span>
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-500">{count} artikel</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}