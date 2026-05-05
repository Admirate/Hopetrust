"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import TherapistCard from "@/components/TherapistCard";
import dynamic from "next/dynamic";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import { fetchDoctors, fetchDepartments, type Doctor } from "@/lib/doctors";
import { Search, AlertCircle } from "lucide-react";

const Footer = dynamic(() => import("@/components/Footer"));

const bookHeadingFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const bookBodyMediumFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500"],
});

function TherapistCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="aspect-[4/3] sm:aspect-square w-full bg-gray-200" />
      <div className="space-y-3 p-4 sm:p-5 lg:p-6">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-5 w-20 rounded-full bg-gray-200" />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
        </div>
        <div className="h-10 w-full rounded-full bg-gray-200 mt-3" />
      </div>
    </div>
  );
}

export default function Page() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchDoctors(), fetchDepartments()])
      .then(([docs, depts]) => {
        if (cancelled) return;
        setDoctors(docs);
        setDepartments(depts);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError("Could not load doctors list. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(search.toLowerCase());
      const matchesDept = !activeDept || doc.department === activeDept;
      return matchesSearch && matchesDept;
    });
  }, [doctors, search, activeDept]);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20">
        <section className="min-h-screen w-full bg-[#F6EFE8] px-4 py-10 sm:px-6 lg:px-8">
          {/* Heading */}
          <h1
            className={`${bookHeadingFont.className} mx-auto mb-3 mt-5 max-w-[568px] text-center text-3xl text-[#00373E] sm:text-4xl lg:text-[56px] lg:leading-[68px]`}
          >
            Book your{" "}
            <span className="relative inline-block">
              sessions
              <span className="absolute -bottom-2 left-0 h-[3px] w-full bg-[#F06D00]" />
            </span>
          </h1>
          <p
            className={`${bookBodyMediumFont.className} mx-auto mb-10 max-w-xl text-center text-sm text-gray-500 sm:text-base`}
          >
            Choose a therapist and book a session at a time that works for you.
          </p>

          {/* Filters — only show once data is loaded */}
          {!loading && !error && (
            <div className="mx-auto mb-8 max-w-5xl space-y-5">
              {/* Search bar */}
              <div className="relative mx-auto max-w-md">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="therapist-search"
                  name="search"
                  placeholder="Search by name or qualification..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${bookBodyMediumFont.className} w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#00373E] focus:shadow-md sm:text-base`}
                />
              </div>

              {/* Department pills */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setActiveDept(null)}
                  className={`${bookBodyMediumFont.className} rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    !activeDept
                      ? "bg-[#00373E] text-white shadow-md"
                      : "bg-white text-[#00373E] border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All ({doctors.length})
                </button>
                {departments.map((dept) => {
                  const count = doctors.filter((d) => d.department === dept).length;
                  return (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(activeDept === dept ? null : dept)}
                      className={`${bookBodyMediumFont.className} rounded-full px-5 py-2 text-sm font-medium transition-all ${
                        activeDept === dept
                          ? "bg-[#00373E] text-white shadow-md"
                          : "bg-white text-[#00373E] border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {dept} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <TherapistCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className={`${bookBodyMediumFont.className} text-base text-gray-500`}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-[#00373E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#025a66] transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* Cards grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {filtered.map((doc) => (
                <TherapistCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className={`${bookBodyMediumFont.className} text-lg text-gray-400`}>
                No therapists found matching your search.
              </p>
              <button
                onClick={() => { setSearch(""); setActiveDept(null); }}
                className="mt-3 text-sm font-semibold text-[#ED7428] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
