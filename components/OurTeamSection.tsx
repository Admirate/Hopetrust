'use client';

import * as React from 'react';
import { Bricolage_Grotesque } from 'next/font/google';

import { cn } from '@/lib/utils';

type TeamCategory = {
  value: 'therapists' | 'counsellors' | 'psychologists' | 'medical-professionals';
  label: string;
};

const headingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600'],
});

const categories: TeamCategory[] = [
  { value: 'therapists', label: 'Therapists.' },
  { value: 'counsellors', label: 'Counsellors.' },
  { value: 'psychologists', label: 'Psychologists.' },
  { value: 'medical-professionals', label: 'Medical professionals.' },
];

export type OurTeamSectionProps = {
  className?: string;
  defaultValue?: TeamCategory['value'];
  autoRotateMs?: number;
  renderContent?: (value: TeamCategory['value']) => React.ReactNode;
};

export default function OurTeamSection({
  className,
  defaultValue = 'therapists',
  autoRotateMs = 1800,
  renderContent,
}: OurTeamSectionProps) {
  const categoryValues = React.useMemo(
    () => categories.map((category) => category.value),
    []
  );

  const [activeValue, setActiveValue] = React.useState<TeamCategory['value']>(
    defaultValue
  );

  React.useEffect(() => {
    if (!autoRotateMs || autoRotateMs <= 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveValue((prev) => {
        const currentIndex = categoryValues.indexOf(prev);
        const safeIndex = currentIndex >= 0 ? currentIndex : 0;
        const nextIndex = (safeIndex + 1) % categoryValues.length;
        return categoryValues[nextIndex];
      });
    }, autoRotateMs);

    return () => window.clearInterval(intervalId);
  }, [autoRotateMs, categoryValues]);

  return (
    <section className={cn('w-full bg-white py-12 sm:py-16', className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <h2
            className={cn(
              headingFont.className,
              'text-center text-[32px] font-semibold leading-none tracking-[0.724px] text-[#F47A24] sm:text-[48px]'
            )}
          >
            Our Team
          </h2>

          <div className="w-full">
            <div
              aria-label="Our Team categories"
              className="flex flex-wrap justify-center gap-8 text-[#D9D9D9] sm:gap-12"
            >
              {categories.map((category) => {
                const isActive = category.value === activeValue;
                return (
                  <span
                    key={category.value}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'select-none text-center text-[18px] font-semibold leading-none tracking-[0.724px] transition-colors',
                      isActive ? 'text-black' : 'text-[#D9D9D9]',
                      'sm:text-[22px]'
                    )}
                  >
                    {category.label}
                  </span>
                );
              })}
            </div>

            {renderContent ? (
              <div className="mt-0">{renderContent(activeValue)}</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}


