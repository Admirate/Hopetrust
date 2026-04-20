import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import { getServiceSchema, getBreadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Intervention Services | Hope Trust - Professional Addiction Intervention',
  description:
    'Hope Trust provides professional intervention services at your doorstep. Help your loved one seek treatment for alcohol, drug misuse, gambling, internet addiction, or other addictive behaviours.',
  keywords:
    'addiction intervention, professional intervention, drug intervention, alcohol intervention, family intervention, Hope Trust intervention, Hyderabad, intervention services',
  alternates: {
    canonical: '/intervention-services/',
  },
  openGraph: {
    title: 'Intervention Services | Hope Trust',
    description:
      'Professional intervention services to help loved ones seek addiction treatment.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function InterventionServicesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={getServiceSchema({
        name: 'Intervention Services',
        description: 'Professional addiction intervention services at your doorstep to help loved ones seek treatment in Hyderabad.',
        url: 'https://hopetrustindia.com/intervention-services/',
        serviceType: 'Addiction Intervention',
      })} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://hopetrustindia.com/' },
        { name: 'Intervention Services', url: 'https://hopetrustindia.com/intervention-services/' },
      ])} />
      {children}
    </>
  );
}
