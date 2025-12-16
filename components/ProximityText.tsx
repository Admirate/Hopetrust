"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type ProximityTextProps = {
  text: string;
  /**
   * Distance in px where the proximity effect reaches 0.
   */
  radius?: number;
  /**
   * Max upward movement in px for the closest letters.
   */
  liftPx?: number;
  className?: string;
  /**
   * If true, newlines in `text` are rendered as line breaks.
   */
  preserveNewlines?: boolean;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

const ProximityText = ({
  text,
  radius = 120,
  liftPx = 6,
  className = "",
  preserveNewlines = true,
}: ProximityTextProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLSpanElement | null>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const tokens = useMemo(() => {
    if (!preserveNewlines) {
      return [{ type: "text" as const, value: text }];
    }

    const parts = text.split("\n");
    const result: Array<{ type: "text" | "br"; value: string }> = [];
    parts.forEach((part, index) => {
      result.push({ type: "text", value: part });
      if (index < parts.length - 1) {
        result.push({ type: "br", value: "" });
      }
    });
    return result;
  }, [preserveNewlines, text]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion) return;

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const point =
        "touches" in event ? event.touches[0] : (event as MouseEvent);
      if (!point) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      mouseRef.current = { x: point.clientX - rect.left, y: point.clientY - rect.top };
    };

    const handlePointerLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("scroll", handlePointerLeave);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion) return;

    let rafId = 0;

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const { x, y } = mouseRef.current;
      if (x === lastMouseRef.current.x && y === lastMouseRef.current.y) return;
      lastMouseRef.current = { x, y };

      const containerRect = rect;
      letterRefs.current.forEach((letterEl) => {
        if (!letterEl) return;
        const letterRect = letterEl.getBoundingClientRect();
        const letterCenterX = letterRect.left + letterRect.width / 2 - containerRect.left;
        const letterCenterY = letterRect.top + letterRect.height / 2 - containerRect.top;

        const dx = letterCenterX - x;
        const dy = letterCenterY - y;
        const distance = Math.hypot(dx, dy);
        const normalized = Math.max(Math.min(1 - distance / radius, 1), 0);

        // Only translate (no font-size/weight/color changes).
        const translateY = -liftPx * normalized;
        letterEl.style.transform = `translate3d(0, ${translateY.toFixed(3)}px, 0)`;
      });
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [liftPx, prefersReducedMotion, radius]);

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  let letterIndex = 0;

  return (
    <span ref={containerRef} className={className}>
      {tokens.map((token, tokenIndex) => {
        if (token.type === "br") {
          return <br key={`br-${tokenIndex}`} />;
        }

        return (
          <span key={`t-${tokenIndex}`} className="whitespace-pre-wrap">
            {token.value.split("").map((char) => {
              const currentIndex = letterIndex;
              letterIndex += 1;
              return (
                <span
                  key={`c-${tokenIndex}-${currentIndex}`}
                  ref={(el) => {
                    letterRefs.current[currentIndex] = el;
                  }}
                  aria-hidden="true"
                  className="inline-block will-change-transform"
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default ProximityText;


