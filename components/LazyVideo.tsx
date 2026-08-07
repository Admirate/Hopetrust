'use client';

import { useEffect, useRef, useState } from 'react';

type LazyVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  /** Start loading this far outside the viewport. */
  rootMargin?: string;
};

/**
 * Autoplaying decorative video that does not download until it is near the
 * viewport.
 *
 * A plain `<video autoplay>` fetches immediately regardless of visibility, and
 * `preload="none"` is not reliably honoured alongside `autoplay`. Withholding
 * the `src` until an IntersectionObserver fires is the only dependable way to
 * keep below-the-fold video off the initial page load.
 */
export default function LazyVideo({
  src,
  className,
  poster,
  rootMargin = '200px',
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver, fall back to loading normally.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={visible ? src : undefined}
      preload={visible ? 'metadata' : 'none'}
      autoPlay
      muted
      playsInline
      loop
      aria-hidden="true"
    />
  );
}
