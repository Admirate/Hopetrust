import type { Faq } from '@/lib/faqs';

/**
 * The visible half of the FAQ. The other half is `FAQPage` JSON-LD in the
 * page's layout, built from the same array — Google requires the markup to
 * correspond to text a visitor can actually see, so the two must never be
 * allowed to drift apart.
 *
 * Built on `<details>` rather than React state: these pages are statically
 * exported, and an accordion that needs no JavaScript is open to a crawler, to
 * a reader on a slow connection, and to in-page search (Ctrl+F reveals matches
 * inside a closed `<details>` in current browsers). It also means the answers
 * are in the HTML, which is what makes them quotable by an answer engine.
 */
export default function FaqSection({
  items,
  heading = 'Frequently asked questions',
}: {
  items: Faq[];
  heading?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section
      className="w-full bg-[#F7F6F4] px-4 py-12 sm:px-8 sm:py-16 lg:px-12"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto w-full max-w-[900px]">
        <h2
          id="faq-heading"
          className="text-2xl font-bold text-[#00373E] sm:text-3xl lg:text-[40px]"
        >
          {heading}
        </h2>

        <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          {items.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-[#00373E]/10 bg-white px-4 py-3.5 transition-colors hover:border-[#ED7428]/40 sm:px-6 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-semibold text-[#00373E] sm:text-lg [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold sm:text-lg">{faq.question}</h3>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-xl leading-none text-[#ED7428] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
