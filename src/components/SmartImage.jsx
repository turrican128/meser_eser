import { useState, useEffect } from 'react';

export default function SmartImage({ src, alt, className = '' }) {
  const [state, setState] = useState(() => ({ src, status: src ? 'loading' : 'error' }));
  const status = state.status;

  if (state.src !== src) {
    setState({ src, status: src ? 'loading' : 'error' });
  }

  useEffect(() => {
    if (!src) return undefined;

    const img = new Image();
    img.onload = () =>
      setState((prev) => (prev.src === src ? { ...prev, status: 'loaded' } : prev));
    img.onerror = () =>
      setState((prev) => (prev.src === src ? { ...prev, status: 'error' } : prev));
    img.src = src;

    // AI image generation can be slow; treat >15s as failed.
    const timeoutId = setTimeout(() => {
      setState((prev) =>
        prev.src === src && prev.status === 'loading' ? { ...prev, status: 'error' } : prev
      );
    }, 15000);

    return () => clearTimeout(timeoutId);
  }, [src]);

  if (status === 'loading') {
    return (
      <div className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-brand-300 border-t-brand-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500">טוען תמונה...</p>
        </div>
      </div>
    );
  }

  if (status === 'loaded') {
    return <img src={src} alt={alt} className={`${className} object-cover`} />;
  }

  // Error fallback — beautiful CSS gradient illustration
  return (
    <div className={`${className} rounded-2xl shadow-xl overflow-hidden relative`}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-300 via-brand-500 to-brand-700"></div>
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
