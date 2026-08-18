import Link from 'next/link';
import { formatDate, readingMin } from '@/lib/posts';
import { href } from '@/lib/url';
import type { Post } from '@/lib/posts';

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Artikel Terkait</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => {
          const gradient = post.slug.charCodeAt(0) % 4;
          const gradients = [
            'from-indigo-500 to-violet-500',
            'from-cyan-500 to-blue-500',
            'from-violet-500 to-fuchsia-500',
            'from-emerald-500 to-cyan-500',
          ];
          return (
            <Link
              key={post.slug}
              href={href(`/posts/${post.slug}/`)}
              prefetch={false}
              className="group card card-hover overflow-hidden"
            >
              <div className={`h-1.5 bg-gradient-to-r ${gradients[gradient]}`} aria-hidden="true" />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-500 mb-2">
                  <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">&middot;</span>
                  <span>{readingMin(post.body)} min</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}