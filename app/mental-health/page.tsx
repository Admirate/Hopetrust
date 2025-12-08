import Header from '@/components/Header';

export default function MentalHealthPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-black">
        {/* Hero section with background video */}
        <section className="relative h-[calc(100vh-5rem)] w-full overflow-hidden">
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            preload="metadata"
          >
            <source src="/mentalhealthherovideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Centered content */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-[48px] font-semibold tracking-[0.18em] uppercase">
              Mental Health
            </h1>

            <div className="mt-6 text-[38px] font-semibold">
              <p>
                <span>Therapy</span>
                <span className="mx-3 text-white/60">|</span>
                <span>Medications</span>
                <span className="mx-3 text-white/60">|</span>
                <span>Couples Therapy</span>
                <span className="mx-3 text-white/60">|</span>
                <span>Family Therapy</span>
              </p>
              <p className="mt-2">&amp; more</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
