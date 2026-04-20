import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getServiceSchema, getBreadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Addiction Recovery Services | Hope Trust - Alcohol, Drug & Behavioural Addiction',
  description:
    'Specialised outpatient and online addiction treatment programs at Hope Trust. Individualised recovery plans for alcohol addiction, nicotine and drug addiction, and behavioural addictions including gaming, gambling, and internet addiction.',
  keywords:
    'addiction recovery, alcohol addiction, drug addiction, nicotine cessation, behavioural addiction, gambling addiction, internet addiction, rehab Hyderabad, Hope Trust',
  alternates: {
    canonical: '/addiction/',
  },
  openGraph: {
    title: 'Addiction Recovery Services | Hope Trust',
    description:
      'Individualised recovery plans for alcohol, drug, nicotine, and behavioural addictions. Outpatient and online treatment available.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function AddictionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getServiceSchema({
        name: 'Addiction Recovery Services',
        description: 'Specialised outpatient and online addiction treatment programs for alcohol, drug, nicotine, and behavioural addictions in Hyderabad.',
        url: 'https://hopetrustindia.com/addiction/',
        serviceType: 'Addiction Treatment',
      })} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://hopetrustindia.com/' },
        { name: 'Addiction Services', url: 'https://hopetrustindia.com/addiction/' },
      ])} />
      {children}
    </>
  );
}
