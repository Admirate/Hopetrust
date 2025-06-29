"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<any>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    
    if (entry.isIntersecting && !hasTriggered) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        setIsVisible(true);
        if (triggerOnce) {
          setHasTriggered(true);
          // Disconnect observer after first trigger for performance
          if (observerRef.current && elementRef.current) {
            observerRef.current.unobserve(elementRef.current);
          }
        }
      });
    } else if (!triggerOnce && !entry.isIntersecting && !hasTriggered) {
      requestAnimationFrame(() => {
        setIsVisible(false);
      });
    }
  }, [hasTriggered, triggerOnce]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current = observer;
    const currentElement = elementRef.current;
    
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement && observer) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { elementRef, isVisible };
};

// Optimized animation variants with GPU acceleration
export const fadeInUp = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 50px, 0)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
  willChange: 'transform, opacity',
});

export const fadeInLeft = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(-50px, 0, 0)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
  willChange: 'transform, opacity',
});

export const fadeInRight = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(50px, 0, 0)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
  willChange: 'transform, opacity',
});

export const scaleIn = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 0, 0) scale(0.8)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
  willChange: 'transform, opacity',
});

export const fadeIn = (isVisible: boolean, delay: number = 0) => ({
  opacity: isVisible ? 1 : 0,
  transition: `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
  willChange: 'opacity',
}); 