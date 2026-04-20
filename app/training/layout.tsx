import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training | Hope Trust - Professional Development Programs',
  description:
    'Professional training and certification programs in mental health, addiction counselling, and therapeutic techniques by Hope Trust. Upskill with evidence-based methodologies from industry experts.',
  keywords:
    'mental health training, addiction counselling course, therapy certification, professional development, Hope Trust training Hyderabad',
  openGraph: {
    title: 'Training | Hope Trust',
    description:
      'Professional training programs in mental health and addiction counselling by Hope Trust.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
