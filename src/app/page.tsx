import Link from 'next/link';
import { getAllPosts, formatDate, getAllTags, readingMin } from '@/lib/posts';
import { href } from '@/lib/url';
import { getNetwork } from '@/lib/network';
import { canonicalUrl, absoluteUrl, getSiteConfig, siteUrl } from '@/lib/site';
import type { Metadata } from 'next';

const site = getSiteConfig();
const network = getNetwork();

export const metadata: Metadata = {
  title: `${site.siteName} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: canonicalUrl('/') },
  openGraph: {
    url: canonicalUrl('/'),
    images: [{ url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: `${site.siteName} — ${site.tagline}` }],
  },
};

const categoryColors: Record<string, string> = {
  'Perkenalan': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Tutorial': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Tips': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'SEO': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'default': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

function PostCard({ post, featured }: { post: ReturnType<typeof getAllPosts>[number]; featured?: boolean }) {
  const gradient = post.slug.charCodeAt(0) % 4;
  const gradients = [
    'from-indigo-500 to-violet-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-fuchsia-500',
    'from-emerald-500 to-cyan-500',
  ];
  return (
    <article className={`group card card-hover overflow-hidden ${featured ? '' : ''}`}>
      <Link href={href(`/posts/${post.slug}/`)} prefetch={false} className="block">
        <div className={`relative overflow-hidden bg-gradient-to-br ${gradients[gradient]} ${featured ? 'aspect-video' : 'aspect-[16/10]'}`}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.35) 0, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0, transparent 40%)' }} />
          <div className="absolute bottom-3 left-3">
            <span className={`badge ${categoryColors[post.category || ''] || categoryColors.default}`}>
              {post.category || 'Article'}
            </span>
          </div>
        </div>
        <div className={`p-5 ${featured ? 'md:p-6' : ''}`}>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-500 mb-2.5">
            <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
            <span className="text-gray-300 dark:text-gray-600">&middot;</span>
            <span>{readingMin(post.body)} min baca</span>
          </div>
          <h2 className={`font-bold tracking-tight text-gray-900 dark:text-white leading-snug group-hover:text-brand transition-colors ${featured ? 'text-xl md:text-2xl mb-2.5' : 'text-base mb-2'}`}>
            {post.title}
          </h2>
          {featured && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>}
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            Baca selengkapnya
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}

function CategoryCard({
  repo,
  name,
  category,
  note,
  palette,
}: {
  repo: string;
  name: string;
  category: string;
  note?: string;
  palette?: { accent: string; accent2: string };
}) {
  const accent = palette?.accent || site.brand.accent;
  const accent2 = palette?.accent2 || site.brand.accent2;
  return (
    <Link
      href={`${siteUrl}/${repo}/`}
      prefetch={false}
      className="group card card-hover p-6 relative overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ backgroundImage: `linear-gradient(to right, ${accent}, ${accent2})` }}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between mb-4">
        <span
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
          aria-hidden="true"
        >
          {name.replace(/^Wim\s*/, '').slice(0, 2).toUpperCase()}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brand" aria-hidden="true">
          <path d="M7 17L17 7M8 7h9v9" />
        </svg>
      </div>
      <h3 className="font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-brand transition-colors">
        {name}
      </h3>
      <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {note || `Situs kategori ${category} dalam jaringan Wim.`}
      </p>
    </Link>
  );
}

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts.slice(0, 2);
  const rest = posts.slice(2, 8);
  const tags = getAllTags().slice(0, 10);
  const totalReadMins = posts.reduce((acc, p) => acc + readingMin(p.body), 0);

  const allSites = [...network.sites, ...network.topics];
  const me = allSites.find((s) => s.repo === site.repo);
  const isPortal = Boolean(me && me.children.length > 0);
  const categories = (me?.children || [])
    .map((repo) => allSites.find((s) => s.repo === repo))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const topicsCount = network.topics.length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-10 md:py-16 mb-10">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand2/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand2/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="badge bg-brand/15 text-brand mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            {isPortal ? `Jaringan ${categories.length} situs niche` : `Blog ${site.categoryLabel}`}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-5">
            {isPortal ? (
              <>
                {site.siteName} — <span className="text-gradient">{site.tagline}</span>
              </>
            ) : (
              <span className="text-gradient">{site.tagline}</span>
            )}
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {site.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={href('/posts/')} prefetch={false} className="btn btn-primary">
              {isPortal ? 'Artikel Terbaru' : 'Jelajahi Artikel'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href={href('/about/')} prefetch={false} className="btn btn-secondary">
              {isPortal ? 'Tentang Jaringan' : 'Tentang Saya'}
            </Link>
          </div>
          {!isPortal && (
            <div className="mt-10 flex items-center justify-center gap-8 text-center">
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{posts.length}+</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Artikel</p>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{tags.length}+</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Topik</p>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{Math.ceil(totalReadMins / 60)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Jam Membaca</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid kategori (hanya untuk portal/hub) */}
      {isPortal && (
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Jelajahi Kategori</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pilih situs niche, setiap kategori punya topik dan konten khusus.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((s) => (
              <CategoryCard
                key={s.repo}
                repo={s.repo}
                name={s.name}
                category={s.category}
                note={s.note}
                palette={network.brandPalettes?.[s.category]}
              />
            ))}
            {topicsCount > 0 && (
              <div className="card p-6 flex flex-col justify-between bg-gradient-to-br from-brand/10 via-brand2/10 to-brand2/10 relative overflow-hidden">
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold bg-brand/15 text-brand" aria-hidden="true">
                    +{topicsCount}
                  </span>
                  <h3 className="mt-4 font-bold tracking-tight text-gray-900 dark:text-white">Topik Spesifik</h3>
                  <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    Situs topik di bawah kategori, misalnya AI, pemrograman, game mobile, dan sepak bola.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured posts */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Artikel Pilihan</h2>
            <Link href={href('/posts/')} prefetch={false} className="text-sm font-semibold text-brand hover:underline underline-offset-4">
              Lihat semua
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((post) => <PostCard key={post.slug} post={post} featured />)}
          </div>
        </section>
      )}

      {/* Recent posts */}
      {rest.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Terbaru</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      )}

      {/* Topics */}
      {tags.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Jelajahi Topik</h2>
          <div className="flex flex-wrap gap-3">
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
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="card p-8 md:p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-brand2/5 to-brand2/5 pointer-events-none" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">Suka dengan konten ini?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6">
            Jelajahi semua artikel dan temukan topik yang paling menarik untukmu.
          </p>
          <Link href={href('/posts/')} prefetch={false} className="btn btn-primary">
            Baca Semua Artikel
          </Link>
        </div>
      </section>
    </div>
  );
}