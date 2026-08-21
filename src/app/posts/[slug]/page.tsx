import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import { getPostBySlug, getAllPosts, getAdjacentPosts, formatDate, readingMin, type Post } from '@/lib/posts';
import { href, tagHref } from '@/lib/url';
import { canonicalUrl, absoluteUrl, getSiteConfig, siteUrl, basePath } from '@/lib/site';
import GiscusComments from '@/components/GiscusComments';
import ShareButtons from '@/components/ShareButtons';
import RelatedPosts from '@/components/RelatedPosts';
import ReadingProgress from '@/components/ReadingProgress';
import BackToTop from '@/components/BackToTop';
import TableOfContents from '@/components/TableOfContents';
import { extractHeadings } from '@/lib/headings';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

const siteConfig = getSiteConfig();

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

function cleanMeta(s: string, max: number): string {
  return s.replace(/\s+/g, ' ').trim().slice(0, max);
}

const trailingWords = /\s+\(?(yang|untuk|dan|dari|sebelum|setelah|dengan|cara|panduan|mengenal|memilih|mengapa|agar|di|ke|dalam|pada|bagi)$/i;

function metaTitle(post: Post): string {
  const raw = (post.metaTitle || post.title).replace(/\s+/g, ' ').trim();
  const budget = 55 - (siteConfig.siteName.length + 3);
  const max = Math.max(30, budget);
  if (raw.length <= max) return raw;
  const cut = raw.slice(0, max).lastIndexOf(' ');
  const shortened = cut > 20 ? raw.slice(0, cut).trim() : raw.slice(0, max).trim();
  let natural = shortened;
  while (trailingWords.test(natural)) natural = natural.replace(trailingWords, '').trim();
  return natural;
}

function metaDescription(post: Post): string {
  const raw = post.metaDescription || post.excerpt || '';
  let desc = cleanMeta(raw, 160);
  if (desc.length >= 155) {
    const cut = desc.slice(0, 152).lastIndexOf(' ');
    if (cut > 40) desc = desc.slice(0, cut).trim();
  }
  return desc;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = canonicalUrl(`/posts/${slug}/`);
  const title = metaTitle(post);
  const description = metaDescription(post);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.date.toISOString(),
      tags: post.tags,
      images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/og.png')],
    },
  };
}

function getRelatedPosts(currentSlug: string, tags: string[]) {
  const allPosts = getAllPosts();
  return allPosts
    .filter((p) => p.slug !== currentSlug && p.tags.some((t) => tags.includes(t)))
    .slice(0, 4);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev: prevPost, next: nextPost } = getAdjacentPosts(slug);

  const url = canonicalUrl(`/posts/${slug}/`);
  const relatedPosts = getRelatedPosts(slug, post.tags);
  const tocHeadings = extractHeadings(post.body);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.date.toISOString(),
    dateModified: post.date.toISOString(),
    wordCount: post.body.split(/\s+/).filter(Boolean).length,
    articleSection: post.category,
    author: {
      '@type': 'Person',
      name: 'aixwim',
      url: absoluteUrl('/about/'),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.svg'),
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: absoluteUrl('/og.png'),
    keywords: post.tags.join(', '),
    inLanguage: 'id-ID',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Posts', item: absoluteUrl('/posts/') },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <link rel="preconnect" href="https://giscus.app" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://giscus.app" />
      <link rel="dns-prefetch" href="https://github.com" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="flex gap-8">
        {/* Sidebar TOC (desktop) */}
        <TableOfContents headings={tocHeadings} />

        <article className="max-w-screen-md flex-1 min-w-0 mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-500 mb-6 flex-wrap" aria-label="Breadcrumb">
            <Link href={href('/')} prefetch={false} className="hover:text-brand transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={href('/posts/')} prefetch={false} className="hover:text-brand transition-colors">Posts</Link>
            <span aria-hidden="true">/</span>
            <span className="text-gray-600 dark:text-gray-300 line-clamp-1">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              {post.category && (
                <span className="badge bg-brand/15 text-brand dark:bg-brand/15 dark:text-brand transition-colors">
                  {post.category}
                </span>
              )}
              <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{readingMin(post.body)} min baca</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.2] mb-5">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{post.excerpt}</p>
            )}

            {/* Author + Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center text-white font-bold text-sm">
                  a
                </span>
                <div>
                  <Link href={href('/about/')} prefetch={false} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-brand transition-colors">
                    aixwim
                  </Link>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Web Developer &amp; Content Creator</p>
                </div>
              </div>
              <ShareButtons title={post.title} url={url} />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={tagHref(tag)}
                    prefetch={false}
                    className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 hover:bg-brand/20 hover:text-brand transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Cover */}
          {post.cover ? (
            <img
              src={post.cover.startsWith('/') ? post.cover : href(`/uploads/${post.cover}`)}
              alt={post.title}
              width={1200}
              height={675}
              className="aspect-[16/9] w-full object-cover rounded-2xl mb-10"
            />
          ) : (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-brand via-brand2 to-brand2">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.35) 0, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25) 0, transparent 40%)' }} aria-hidden="true" />
              <span className="absolute bottom-4 left-4 text-white font-extrabold tracking-tight text-2xl md:text-3xl drop-shadow-lg px-2">
                {post.title}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <MDXRemote source={post.body} options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }} />
          </div>

          {/* Author box */}
          <div className="mt-12 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-brand/10 to-brand2/10 dark:from-gray-900 dark:to-gray-900 p-6 flex flex-col sm:flex-row gap-4 items-start">
            <span className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center text-white font-bold text-xl shrink-0">
              a
            </span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white mb-1">Ditulis oleh aixwim</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Seorang web developer yang suka berbagi pengetahuan tentang teknologi, SEO, dan pengembangan web. Semoga artikel ini bermanfaat untukmu!
              </p>
            </div>
          </div>

          {/* Share bottom */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <ShareButtons title={post.title} url={url} />
            <Link href={href('/posts/')} prefetch={false} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand transition-colors">
              Semua artikel &rarr;
            </Link>
          </div>

          {/* Prev / Next */}
          <nav className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Navigasi artikel">
            {prevPost ? (
              <Link href={href(`/posts/${prevPost.slug}/`)} prefetch={false} className="group card card-hover p-5">
                <span className="text-xs text-gray-600 dark:text-gray-500 flex items-center gap-1 mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
                  Artikel sebelumnya
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand transition-colors line-clamp-2">
                  {prevPost.title}
                </span>
              </Link>
            ) : <span />}
            {nextPost && (
              <Link href={href(`/posts/${nextPost.slug}/`)} prefetch={false} className="group card card-hover p-5 text-right">
                <span className="text-xs text-gray-600 dark:text-gray-500 flex items-center justify-end gap-1 mb-2">
                  Artikel berikutnya
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand transition-colors line-clamp-2">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </nav>

          {/* Related posts */}
          <RelatedPosts posts={relatedPosts} />

          {/* Komentar */}
          <GiscusComments
            repo={getSiteConfig().repo}
            repoId={getSiteConfig().giscus?.repoId}
            categoryId={getSiteConfig().giscus?.categoryId}
            theme={`${siteUrl}${basePath}/giscus-dark.css`}
          />
        </article>
      </div>

      <BackToTop />
    </>
  );
}
