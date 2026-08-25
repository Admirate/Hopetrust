# Author attribution and medical review

Every article on this site is health content, and search engines and AI answer
engines both weigh *who* stands behind it. This document describes how a post
gets a named clinician byline and a medical review notice.

## The frontmatter contract

Three optional fields in `content/blogs/*.mdx`:

```yaml
authorSlug: rajeshwari-luther   # practitioner who wrote the post
reviewedBy: nishanth-vemana     # clinician who checked it for accuracy
reviewedOn: 2026-08-25          # ISO date the review happened
```

All three are optional, and each one is a factual claim:

- **`authorSlug`** must be the practitioner who actually wrote or substantively
  shaped the post.
- **`reviewedBy`** must be a clinician who has actually read the post and
  confirmed it is accurate. It asserts a real editorial process to readers who
  may act on the content.
- **`reviewedOn`** is required alongside `reviewedBy`. A reviewer with no date
  is dropped at build time rather than rendered undated — an undated review
  claim tells a reader nothing about whether the check is still current.

The values are practitioner slugs from the `doctors` table, matching the
`/therapists/<slug>/` URLs. Run `node scripts/attribution.mjs report` for the
current list. An unknown slug degrades that post to the organisation byline
rather than breaking the build.

A post with none of these fields keeps the `Hope Trust` organisation byline.
That is the correct state for a post nobody has claimed — it is honest, and it
is better than a byline nobody stands behind.

## What the fields produce

| | Named author | Medical reviewer |
|---|---|---|
| Visible | Byline linking to the profile, with credentials | "Medically reviewed by …" notice under the title |
| Schema | `BlogPosting.author` → `@id` of the person | `MedicalWebPage.reviewedBy` + `lastReviewed` |
| Profile page | Listed under "Articles by …" | Listed under "Medically reviewed by …" |

The `@id` is the join. A practitioner's `Person` node — name, `jobTitle`,
`hasCredential`, `worksFor` — is defined once on their profile page at
`/therapists/<slug>/#person`. Articles reference that node rather than
repeating a name string, so the credentials declared in one place attach to
every article that person signs.

### Person vs Physician

`schema.org/Physician` is a `MedicalOrganization`, not a `Person`. It describes
a practice. It is emitted only for practitioners whose qualification indicates a
registered medical doctor (`MD`, `MBBS`, `DNB`, `DPM`, `MRCPsych`).

Psychologists and social workers get a `Person` node only. They are clinicians,
but marking a psychologist as a physician overstates their credentials — on
health content that is the precise failure this system exists to prevent. The
classification lives in `lib/authors.ts` and is covered by
`tests/vitest/lib/authors.test.ts`.

## Applying attribution in bulk

`scripts/attribution.mjs` applies a mapping you write. It does not infer
attribution — deciding that a named clinician wrote or reviewed an article is a
statement about a real person's professional work, so it has to come from
someone who knows the answer.

```bash
node scripts/attribution.mjs report                              # coverage + valid slugs
node scripts/attribution.mjs apply content/attribution.json --dry-run
node scripts/attribution.mjs apply content/attribution.json
```

Mapping format:

```json
{
  "reviewedOn": "2026-08-25",
  "rules": [
    {
      "match": ["alcohol", "drinking", "sobriety"],
      "author": "rajeshwari-luther",
      "reviewedBy": "nishanth-vemana"
    }
  ],
  "bySlug": {
    "10-things-i-learnt-in-rehab": { "author": "rajeshwari-luther" }
  }
}
```

`match` entries are case-insensitive substrings tested against the post slug and
title; the first matching rule wins. `bySlug` overrides `rules`. The script
refuses to run if the mapping names a slug that is not a current practitioner.

## Suggested order of work

Attribution does not have to land all at once, and the highest-traffic posts are
worth doing first. A reasonable sequence:

1. Clinical posts on addiction, withdrawal, medication, and diagnosis — the
   pages where a reader is most likely to act on what they read.
2. The rest of the mental-health explainers.
3. General-wellbeing and lifestyle posts, which can reasonably keep the
   organisation byline.

Re-run `node scripts/attribution.mjs report` to track coverage.
