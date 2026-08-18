'use client';
import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/headings';

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto rounded-xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-500 mb-3">
          Daftar Isi
        </p>
        <nav className="space-y-1" aria-label="Daftar isi">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-sm leading-snug rounded-md px-2 py-1.5 transition-colors ${
                h.level === 3 ? 'ml-3' : ''
              } ${
                activeId === h.id
                  ? 'bg-brand/20 text-brand font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}