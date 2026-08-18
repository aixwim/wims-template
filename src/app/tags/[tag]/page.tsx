import Link from 'next/link';
import { getPostsByTag, getAllTags, formatDate } from '@/lib/posts';
import { href } from '@/lib/url';
import { canonicalUrl } from '@/lib/site';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag}`,
    description: `Artikel dengan tag ${tag}.`,
    alternates: { canonical: canonicalUrl(`/tags/${tag}/`) },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Artikel dengan tag ${tag}`,
    url: canonicalUrl(`/tags/${tag}/`),
    numberOfItems: posts.length,
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: post.title,
      url: canonicalUrl(`/posts/${post.slug}/`),
      datePublished: post.date.toISOString(),
    })),
  };

  return (
    <section className="max-w-screen-md">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <header className="mb-10">
        <span className="badge bg-brand/15 text-brand mb-4">Tag</span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          {tag}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{posts.length} artikel dengan tag ini.</p>
      </header>

      <div className="space-y-2">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={href(`/posts/${post.slug}/`)}
            prefetch={false}
            className={`group flex items-baseline gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 ${i !== posts.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
          >
            <time className="text-xs text-gray-600 dark:text-gray-500 tabular-nums shrink-0 w-20 hidden sm:block" dateTime={post.date.toISOString()}>
              {formatDate(post.date)}
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

      <div className="mt-10">
        <Link href={href('/tags/')} prefetch={false} className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline underline-offset-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          Semua tag
        </Link>
      </div>
    </section>
  );
}