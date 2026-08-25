import { describe, it, expect } from 'vitest';
import {
  toAuthor,
  personId,
  personSchema,
  credentialSchema,
  withCredential,
  organizationAuthorRef,
} from '@/lib/authors';
import type { Doctor } from '@/lib/doctors';

function doctor(overrides: Partial<Doctor> = {}): Doctor {
  return {
    id: '1',
    slug: 'k-aparna',
    name: 'Dr. K. Aparna',
    qualification: 'MD Psychiatry',
    department: 'Psychiatry',
    bio: 'A bio.',
    bookingUrl: 'https://booking.example/aparna',
    displayOrder: 1,
    ...overrides,
  };
}

describe('isMedicalDoctor', () => {
  // The whole point of the byline work is that credentials are stated
  // accurately, so this classification is the part most worth pinning down.
  it.each([
    ['MD Psychiatry', true],
    ['MBBS, MD', true],
    ['DNB Psychiatry', true],
    ['DPM', true],
  ])('treats %s as a medical doctor', (qualification, expected) => {
    expect(toAuthor(doctor({ qualification })).isMedicalDoctor).toBe(expected);
  });

  it.each([
    ['MA Psychology'],
    ['MPhil Clinical Psychology'],
    ['PhD Psychology'],
    ['PGDP in Clinical Psychology'],
    ['MPhil in Social Work'],
    ['MSc Psychology'],
  ])('does not treat %s as a medical doctor', (qualification) => {
    expect(toAuthor(doctor({ qualification })).isMedicalDoctor).toBe(false);
  });

  it('does not match MD inside an unrelated word', () => {
    expect(toAuthor(doctor({ qualification: 'Biomedical Sciences' })).isMedicalDoctor).toBe(
      false
    );
  });
});

describe('personId', () => {
  it('is stable and profile-scoped', () => {
    expect(personId('k-aparna')).toBe(
      'https://hopetrustindia.com/therapists/k-aparna/#person'
    );
  });

  it('matches the id an author node resolves to', () => {
    expect(toAuthor(doctor()).id).toBe(personId('k-aparna'));
  });
});

describe('personSchema', () => {
  it('is a Person, not a Physician', () => {
    // schema.org Physician is a MedicalOrganization, so it cannot carry the
    // person-level credential signal an article byline needs.
    expect(personSchema(toAuthor(doctor()))['@type']).toBe('Person');
  });

  it('declares credentials', () => {
    expect(personSchema(toAuthor(doctor())).hasCredential).toEqual({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: 'MD Psychiatry',
      educationalLevel: 'Postgraduate',
    });
  });

  it('names psychiatry as a job title, not a department label', () => {
    expect(personSchema(toAuthor(doctor())).jobTitle).toBe('Psychiatrist');
  });

  it('omits the booking action when there is no booking url', () => {
    expect(personSchema(toAuthor(doctor()))).not.toHaveProperty('potentialAction');
  });

  it('links the person to the organisation', () => {
    expect(personSchema(toAuthor(doctor())).worksFor).toEqual({
      '@id': 'https://hopetrustindia.com/#organization',
    });
  });
});

describe('credentialSchema', () => {
  it('marks postgraduate qualifications', () => {
    expect(credentialSchema('MPhil Clinical Psychology').educationalLevel).toBe(
      'Postgraduate'
    );
  });

  it('leaves educationalLevel off qualifications it cannot place', () => {
    expect(credentialSchema('Certified Counsellor')).not.toHaveProperty(
      'educationalLevel'
    );
  });
});

describe('withCredential', () => {
  it('renders the byline form', () => {
    expect(withCredential(toAuthor(doctor()))).toBe('Dr. K. Aparna, MD Psychiatry');
  });
});

describe('organizationAuthorRef', () => {
  it('falls back to the organisation node', () => {
    expect(organizationAuthorRef()['@id']).toBe(
      'https://hopetrustindia.com/#organization'
    );
  });
});
