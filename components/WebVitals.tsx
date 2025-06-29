"use client";

import { useEffect } from 'react';

interface WebVitalsProps {
  onMetric?: (metric: any) => void;
}

export default function WebVitals({ onMetric }: WebVitalsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Only load web-vitals in production
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        const vitalsHandler = (metric: any) => {
          if (onMetric) {
            onMetric(metric);
          }
        };

        getCLS(vitalsHandler);
        getFID(vitalsHandler);
        getFCP(vitalsHandler);
        getLCP(vitalsHandler);
        getTTFB(vitalsHandler);
      }).catch(() => {
        // Silently fail if web-vitals is not available
      });
    }
  }, [onMetric]);

  return null;
} 