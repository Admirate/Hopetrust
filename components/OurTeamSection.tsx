'use client';

import * as React from 'react';
import { Bricolage_Grotesque } from 'next/font/google';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  renderContent?: (value: TeamCategory['value']) => React.ReactNode;
};

export default function OurTeamSection({
  className,
  defaultValue = 'therapists',
  renderContent,
}: OurTeamSectionProps) {
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

          <Tabs defaultValue={defaultValue} className="w-full">
            <div className="flex justify-center">
              <TabsList
                aria-label="Our Team categories"
                className="h-auto flex-wrap justify-center gap-8 bg-transparent p-0 text-[#CFCFCF] sm:gap-12"
              >
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    aria-label={category.label.replace('.', '')}
                    className={cn(
                      'h-auto rounded-none bg-transparent p-0 text-center text-[18px] font-semibold leading-none tracking-[0.724px] text-[#D9D9D9] shadow-none transition-colors',
                      'hover:text-[#8C8C8C] focus-visible:ring-2 focus-visible:ring-[#F47A24]/40 focus-visible:ring-offset-4',
                      'data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none',
                      'sm:text-[22px]'
                    )}
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value} className="mt-0">
                {renderContent ? renderContent(category.value) : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}


