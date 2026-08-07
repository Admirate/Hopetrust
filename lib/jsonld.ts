import { siteConfig } from '@/lib/config';
import { getLogoUrl } from '@/lib/assets';

const SITE_URL = siteConfig.url;

/** Organization + LocalBusiness — injected in root layout */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'MedicalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Hope Trust',
    alternateName: 'Hope Trust India',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: getLogoUrl(),
      width: 512,
      height: 512,
    },
    image: getLogoUrl(),
    description: siteConfig.name + ' — A place for hope, healing, and renewal. Mental health and addiction recovery services in Hyderabad.',
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.streetAddress,
      addressLocality: siteConfig.contact.address.locality,
      addressRegion: siteConfig.contact.address.region,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.4142,
      longitude: 78.4191,
    },
    sameAs: [
      'https://www.instagram.com/hopetrust?igsh=N2hvNmtmcHZ3emxi',
      'https://www.facebook.com/hopetrust',
      'https://www.linkedin.com/company/hope-trust/',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: siteConfig.hours.days,
      opens: siteConfig.hours.opens,
      closes: siteConfig.hours.closes,
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Hyderabad',
    },
    medicalSpecialty: [
      'Psychiatry',
      'Psychology',
      'Addiction Medicine',
    ],
  };
}

/** WebSite schema with search action */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Hope Trust',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** BreadcrumbList helper */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Service schema for service pages */
export function getServiceSchema(opts: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalTherapy',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.serviceType || opts.name,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: {
      '@type': 'City',
      name: 'Hyderabad',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_URL}/book-your-session/`,
      serviceSmsNumber: siteConfig.contact.phone,
    },
  };
}

/** FAQPage schema */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
