import type { Metadata } from 'next';
import { canonicalUrl, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi aixwim untuk pertanyaan, saran, atau kolaborasi.',
  alternates: { canonical: canonicalUrl('/contact/') },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact aixwim',
  url: absoluteUrl('/contact/'),
};

export default function ContactPage() {
  return (
    <section className="max-w-screen-md mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-10">
        <span className="badge bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300 mb-4">Kontak</span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Mari Terhubung
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl">
          Ada pertanyaan, saran, atau ingin berkolaborasi? Jangan ragu untuk menghubungi saya.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hello@aixwim.dev"
          className="group card card-hover p-6 flex items-start gap-4"
        >
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" />
            </svg>
          </span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1">Email</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">hello@aixwim.dev</p>
          </div>
        </a>

        <a
          href="https://github.com/aixwim"
          target="_blank"
          rel="noopener noreferrer"
          className="group card card-hover p-6 flex items-start gap-4"
        >
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0022 12.25C22 6.58 17.52 2 12 2z" />
            </svg>
          </span>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white mb-1">GitHub</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">github.com/aixwim</p>
          </div>
        </a>
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-brand/10 to-brand2/10 dark:from-brand/10 dark:to-brand2/10 border border-gray-100 dark:border-gray-800 p-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        Saya biasanya merespons dalam 1–2 hari kerja. Untuk laporan bug atau pertanyaan teknis yang mendesak, email adalah cara tercepat untuk menghubungi saya.
      </div>
    </section>
  );
}