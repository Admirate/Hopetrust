import { describe, it, expect } from 'vitest';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getServiceSchema,
  getBreadcrumbSchema,
  getFAQSchema,
} from '@/lib/jsonld';

describe('JSON-LD Schema Generators', () => {
  describe('getOrganizationSchema', () => {
    it('returns valid Organization schema', () => {
      const schema = getOrganizationSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toContain('Organization');
      expect(schema.name).toBe('Hope Trust');
      expect(schema.url).toMatch(/^https?:\/\//);
    });

    it('includes address information', () => {
      const schema = getOrganizationSchema();
      expect(schema.address).toBeDefined();
      expect(schema.address['@type']).toBe('PostalAddress');
    });

    it('includes geo coordinates', () => {
      const schema = getOrganizationSchema();
      expect(schema.geo).toBeDefined();
      expect(schema.geo['@type']).toBe('GeoCoordinates');
    });
  });

  describe('getWebSiteSchema', () => {
    it('returns valid WebSite schema', () => {
      const schema = getWebSiteSchema();
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Hope Trust');
      expect(schema.url).toMatch(/^https?:\/\//);
    });
  });

  describe('getServiceSchema', () => {
    it('returns valid Service schema', () => {
      const schema = getServiceSchema({
        name: 'Addiction Recovery',
        description: 'Comprehensive addiction treatment',
        url: '/addiction',
        serviceType: 'AddictionTreatment',
      });
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema.name).toBe('Addiction Recovery');
      expect(schema.description).toBe('Comprehensive addiction treatment');
    });
  });

  describe('getBreadcrumbSchema', () => {
    it('returns valid BreadcrumbList schema', () => {
      const items = [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ];
      const schema = getBreadcrumbSchema(items);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
    });

    it('handles empty items', () => {
      const schema = getBreadcrumbSchema([]);
      expect(schema.itemListElement).toHaveLength(0);
    });
  });

  describe('getFAQSchema', () => {
    it('returns valid FAQPage schema', () => {
      const faqs = [
        { question: 'What is therapy?', answer: 'Therapy is a treatment...' },
        { question: 'How long?', answer: '6-12 weeks typically.' },
      ];
      const schema = getFAQSchema(faqs);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0].name).toBe('What is therapy?');
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe('Therapy is a treatment...');
    });
  });
});
