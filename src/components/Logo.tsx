import Link from 'next/link';
import { href } from '@/lib/url';

export default function Logo({ siteName, logoText, logoPrefix }: { siteName: string; logoText: string; logoPrefix: string }) {
  return (
    <Link
      href={href('/')}
      prefetch={false}
      className="group flex items-center gap-2.5"
      aria-label={`${siteName} — Home`}
    >
      <span
        className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, var(--brand-accent), var(--brand-accent2) 50%, var(--brand-accent2))`,
          boxShadow: '0 4px 14px color-mix(in srgb, var(--brand-accent) 30%, transparent)',
        }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 16.5 5.8 21l2.4-7.3L2 9.2h7.6z" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        {logoPrefix}
        <span className="text-gradient">{logoText}</span>
      </span>
    </Link>
  );
}