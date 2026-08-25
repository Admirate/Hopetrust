import Link from 'next/link';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import type { Topic } from '@/lib/post-topics';

/**
 * The call to action at the foot of every article.
 *
 * The archive is 395 posts that, until now, linked to no service page at all —
 * a large body of content earning attention and passing none of it on. This is
 * the fix for the structural half of that: every post now reaches the service
 * that matches its subject, plus booking, without an editor touching the prose.
 */
export default function PostFooterCta({ topic }: { topic: Topic }) {
  return (
    <aside className="mt-10 rounded-2xl border border-[#00373E]/10 bg-[#F2F7F7] p-5 sm:mt-12 sm:rounded-[24px] sm:p-7">
      <h2 className="text-lg font-semibold text-[#00373E] sm:text-xl">{topic.heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{topic.blurb}</p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <Link
          href={topic.href}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00373E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#025a66]"
        >
          {topic.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/book-your-session/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#00373E]/20 bg-white px-5 py-3 text-sm font-semibold text-[#00373E] transition-colors hover:border-[#ED7428] hover:text-[#ED7428]"
        >
          <CalendarCheck className="h-4 w-4" />
          Book a session
        </Link>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-gray-500">
        This article is general information about mental health and addiction, not a
        substitute for individual clinical assessment. If you or someone else is in
        immediate danger, contact local emergency services.
      </p>
    </aside>
  );
}
