'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface FadeInSectionProps {
  children: ReactNode;
  /**
   * Delay in milliseconds before the animation starts.
   * (Matches how you already pass 100, 150, 200, etc.)
   */
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
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 0.61, 0.36, 1],
        delay: delay / 1000, // convert ms -> seconds
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


