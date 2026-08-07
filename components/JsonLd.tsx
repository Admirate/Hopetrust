/**
 * Serialises JSON-LD for inline injection.
 *
 * `JSON.stringify` escapes quotes but not `<`, so a value containing the
 * literal `</script>` (e.g. a blog post title) would close the tag early and
 * leak markup into the document. Escaping it as the < escape sequence is still valid JSON
 * and parses back to the same string.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
