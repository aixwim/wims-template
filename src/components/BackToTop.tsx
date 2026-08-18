'use client';
import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-br from-brand to-brand2 text-white rounded-full shadow-lg shadow-brand/30 hover:shadow-xl hover:scale-105 transition-all"
      aria-label="Kembali ke atas"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
