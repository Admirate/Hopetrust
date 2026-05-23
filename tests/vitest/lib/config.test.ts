import { describe, it, expect } from 'vitest';
import { siteConfig } from '@/lib/config';

describe('siteConfig', () => {
  it('has correct site name', () => {
    expect(siteConfig.name).toBe('Hope Trust India');
  });

  it('has a valid site URL', () => {
    expect(siteConfig.url).toMatch(/^https?:\/\//);
  });

  it('has contact email addresses', () => {
    expect(siteConfig.contact.email).toBe('frontoffice@hopetrustindia.com');
    expect(siteConfig.contact.trainingEmail).toBe('training@hopetrustindia.com');
  });

  it('has phone numbers', () => {
    expect(siteConfig.contact.phone).toMatch(/^\+91/);
    expect(siteConfig.contact.phone2).toMatch(/^\+91/);
    expect(siteConfig.contact.trainingPhone).toMatch(/^\+91/);
  });

  // WHATSAPP CRM DISABLED — uncomment when new CRM is integrated
  // it('has a WhatsApp URL', () => {
  //   expect(siteConfig.contact.whatsappUrl).toMatch(/^https:\/\/wa\.me\//);
  // });

  it('has a complete address', () => {
    expect(siteConfig.contact.address.full).toBeTruthy();
    expect(siteConfig.contact.address.line1).toBeTruthy();
    expect(siteConfig.contact.address.mapsUrl).toMatch(/^https:\/\/www\.google\.com\/maps/);
  });

  it('has Google Maps embed URL', () => {
    expect(siteConfig.maps.embedUrl).toMatch(/^https:\/\/www\.google\.com\/maps\/embed/);
  });
});
