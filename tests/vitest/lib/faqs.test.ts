import { describe, it, expect } from 'vitest';
import {
  addictionFaqs,
  mentalHealthFaqs,
  interventionFaqs,
  corporateFaqs,
  trainingFaqs,
  type Faq,
} from '@/lib/faqs';
import { getFAQSchema } from '@/lib/jsonld';

const SETS: [string, Faq[]][] = [
  ['addiction', addictionFaqs],
  ['mental health', mentalHealthFaqs],
  ['intervention', interventionFaqs],
  ['corporate wellness', corporateFaqs],
  ['training', trainingFaqs],
];

describe.each(SETS)('%s FAQs', (_name, faqs) => {
  it('has enough questions to be worth marking up, and not so many it is padding', () => {
    expect(faqs.length).toBeGreaterThanOrEqual(6);
    expect(faqs.length).toBeLessThanOrEqual(10);
  });

  it('asks actual questions', () => {
    for (const faq of faqs) expect(faq.question).toMatch(/\?$/);
  });

  it('answers substantively', () => {
    // A one-line answer is not what gets quoted back by an answer engine, and
    // is not what someone deciding whether to call is looking for.
    for (const faq of faqs) expect(faq.answer.length).toBeGreaterThan(60);
  });

  it('has no duplicate questions', () => {
    const seen = new Set(faqs.map((f) => f.question.toLowerCase()));
    expect(seen.size).toBe(faqs.length);
  });

  it('leaves no unresolved template placeholders', () => {
    for (const faq of faqs) {
      expect(faq.answer).not.toMatch(/\$\{|TODO|TBD|Lorem/i);
    }
  });
});

describe('FAQ schema', () => {
  it('is built from the same array the page renders', () => {
    // Google requires FAQPage markup to correspond to visible text. Both sides
    // read this array, so the guarantee is structural rather than a promise.
    const schema = getFAQSchema(addictionFaqs);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(addictionFaqs.length);
    expect(schema.mainEntity[0].name).toBe(addictionFaqs[0].question);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(addictionFaqs[0].answer);
  });

  it('types every entry as a Question with an accepted Answer', () => {
    for (const entry of getFAQSchema(mentalHealthFaqs).mainEntity) {
      expect(entry['@type']).toBe('Question');
      expect(entry.acceptedAnswer['@type']).toBe('Answer');
    }
  });
});

describe('addiction pricing answers', () => {
  it('quotes the programme prices the page itself shows', () => {
    // If a price changes on /addiction/ and not here, the page contradicts its
    // own structured data — this is the check that surfaces it.
    const priced = addictionFaqs.find((f) => /cost/i.test(f.question));
    expect(priced).toBeDefined();
    for (const amount of ['26,500', '18,000', '10,500']) {
      expect(priced!.answer).toContain(amount);
    }
  });
});
