import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found | Hope Trust',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F6F4] px-4 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#ED7428]">
        404
      </p>
      <h1 className="mb-4 text-3xl font-bold text-[#00373E] sm:text-5xl">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-base text-[#486364] sm:text-lg">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-[#00373E] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#024a53] hover:-translate-y-0.5 hover:shadow-lg"
      >
        Back to Home
      </Link>
    </main>
  );
}
