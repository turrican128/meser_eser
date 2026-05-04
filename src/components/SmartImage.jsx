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

    const timeoutId = setTimeout(() => {
      setState((prev) =>
        prev.src === src && prev.status === 'loading' ? { ...prev, status: 'error' } : prev
      );
    }, 12000);

    return () => clearTimeout(timeoutId);
  }, [src]);

  if (status === 'loading') {
    return (
      <div className={`${className} bg-cream-200 flex items-center justify-center overflow-hidden`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-ink-500"
            dir="ltr"
          >
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (status === 'loaded') {
    return <img src={src} alt={alt} className={`${className} object-cover`} />;
  }

  // Error fallback — editorial cream + terracotta hairline composition.
  return (
    <div className={`${className} relative overflow-hidden bg-cream-200`}>
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-cream-100 to-cream-200" />
        <div className="h-[40%] bg-brand-600" />
      </div>
      <div className="absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-ink-900" />
        </svg>
      </div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
        <div className="w-12 h-px bg-brand-600" />
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-ink-700 font-medium"
          dir="ltr"
        >
          Featured
        </p>
      </div>
    </div>
  );
}
