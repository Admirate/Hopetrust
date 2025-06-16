"use client";

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isVisible };
};

// Animation variants for different effects
export const fadeInUp = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
});

export const fadeInLeft = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
});

export const fadeInRight = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
});

export const scaleIn = (isVisible: boolean, delay: number = 0) => ({
  transform: isVisible ? 'scale(1)' : 'scale(0.8)',
  opacity: isVisible ? 1 : 0,
  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
});

export const fadeIn = (isVisible: boolean, delay: number = 0) => ({
  opacity: isVisible ? 1 : 0,
  transition: `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
}); 