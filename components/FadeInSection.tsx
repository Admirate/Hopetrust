'use client';

import { ReactNode } from 'react';
import { fadeIn, useScrollAnimation } from '@/hooks/useScrollAnimation';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeInSection({
  children,
  delay = 0,
  className = '',
}: FadeInSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  return (
    <div
      ref={elementRef}
      style={fadeIn(isVisible, delay)}
      className={className}
    >
      {children}
    </div>
  );
}


