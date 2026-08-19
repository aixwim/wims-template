'use client';
import { useEffect, useRef } from 'react';

const GISCUS_BASE = 'https://giscus.app';

export default function GiscusComments({
  repo,
  theme,
  repoId,
  categoryId,
}: {
  repo: string;
  theme: string;
  repoId?: string;
  categoryId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const loadGiscus = () => {
      const script = document.createElement('script');
      script.src = `${GISCUS_BASE}/client.js`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-repo', `aixwim/${repo}`);
      if (repoId) script.setAttribute('data-repo-id', repoId);
      script.setAttribute('data-category', 'General');
      if (categoryId) script.setAttribute('data-category-id', categoryId);
      script.setAttribute('data-mapping', 'pathname');
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '1');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', 'top');
      script.setAttribute('data-theme', theme);
      script.setAttribute('data-lang', 'id');
      script.setAttribute('data-loading', 'lazy');
      document.head.appendChild(script);
    };

    let loaded = false;
    const loadIfVisible = () => {
      if (loaded) return;
      loaded = true;
      loadGiscus();
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadIfVisible();
      },
      { rootMargin: '1200px 0px' }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      document.querySelectorAll(`script[data-repo="aixwim/${repo}"]`).forEach((s) => s.remove());
    };
  }, [repo, theme, repoId, categoryId]);

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-6">Komentar</h2>
      <div className="giscus" ref={containerRef} />
    </div>
  );
}