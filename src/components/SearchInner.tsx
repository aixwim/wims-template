'use client';
import { useState } from 'react';
import Link from 'next/link';
import { href } from '@/lib/url';
import { formatDate } from '@/lib/format';
import type { Post } from '@/lib/posts';

type SearchItem = Pick<Post, 'slug' | 'title' | 'excerpt' | 'tags' | 'date'>;

export default function SearchInner({ searchIndex }: { searchIndex: SearchItem[] }) {
  const [q, setQ] = useState('');

  const query = q.toLowerCase().trim();
  const results = query
    ? searchIndex.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.tags.some((t) => t.includes(query))
      )
    : [];

  return (
    <div>
      <div className="relative mb-8">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <label htmlFor="search-input" className="sr-only">Cari artikel</label>
        <input
          id="search-input"
          type="search"
          className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-12 pr-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-gray-400"
          placeholder="Cari judul, isi, atau tag..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </div>

      {query && results.length === 0 && (
        <div className="text-center py-14">
          <p className="text-gray-600 dark:text-gray-500 mb-2 text-5xl" aria-hidden="true">&#128269;</p>
          <p className="text-gray-600 dark:text-gray-400">Tidak ada artikel untuk &ldquo;{q}&rdquo;</p>
          <p className="text-sm text-gray-600 dark:text-gray-500 mt-1">Coba kata kunci lain.</p>
        </div>
      )}

      {query && results.length > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">
          {results.length} hasil untuk &ldquo;{q}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((post) => (
            <Link
              key={post.slug}
              href={href(`/posts/${post.slug}/`)}
              prefetch={false}
              className="group block rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800 hover:border-brand/50 dark:hover:border-brand/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-500 mb-1.5">
                <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{tag}</span>
                ))}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}