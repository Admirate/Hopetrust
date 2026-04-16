import Link from 'next/link';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import { Bricolage_Grotesque } from 'next/font/google';

const Footer = dynamic(() => import('@/components/Footer'));

const headingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700'],
});

const bodyFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata = {
  title: 'Sitemap | Hope Trust',
  description: 'Browse all pages on the Hope Trust website.',
};

type SitemapSection = {
  title: string;
  links: { label: string; href: string }[];
};

const sections: SitemapSection[] = [
  {
    title: 'Main Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Book Your Session', href: '/book-your-session' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Mental Health', href: '/mental-health' },
      { label: 'Addiction Services', href: '/addiction' },
      { label: 'Corporate Wellness', href: '/corporate-wellness' },
      { label: 'Intervention Services', href: '/intervention-services' },
      { label: 'Training', href: '/training' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blogs', href: '/blogs' },
    ],
  },
  {
    title: 'Careers',
    links: [
      { label: 'Join Us', href: '/join-us' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F5EF]">
        <section className="mx-auto max-w-4xl px-4 sm:px-8 pb-20 pt-32 sm:pt-36">
          <h1
            className={`${headingFont.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00373E] mb-4`}
          >
            Sitemap
          </h1>
          <p
            className={`${bodyFont.className} text-base sm:text-lg text-[#00373E]/70 mb-12`}
          >
            A complete list of all pages on our website.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2
                  className={`${headingFont.className} text-xl sm:text-2xl font-semibold text-[#00373E] mb-4 border-b-2 border-[#ED7428]/30 pb-2`}
                >
                  {section.title}
                </h2>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`${bodyFont.className} text-[#00373E] hover:text-[#ED7428] transition-colors text-base sm:text-lg`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
