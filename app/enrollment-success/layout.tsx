import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enrollment Confirmed',
  description: 'Your Hope Trust program enrollment is being confirmed.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/enrollment-success/' },
};

export default function EnrollmentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
