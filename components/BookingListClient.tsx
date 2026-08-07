"use client";

import { useState, useMemo } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Search } from "lucide-react";
import TherapistCard from "@/components/TherapistCard";
import type { Doctor } from "@/lib/doctors";

const bookBodyMediumFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500"],
});

/**
 * Search and department filtering for the therapist directory.
 *
 * Data arrives as props from the server component so every practitioner is
 * present in the static HTML — this island only owns filter state.
 */
export default function BookingListClient({
  doctors,
  departments,
}: {
  doctors: Doctor[];
  departments: string[];
}) {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<string | null>(null);

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
      {/* Filters */}
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

      {/* Cards grid */}
      {filtered.length > 0 && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {filtered.map((doc) => (
            <TherapistCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className={`${bookBodyMediumFont.className} text-lg text-gray-400`}>
            No therapists found matching your search.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveDept(null);
            }}
            className="mt-3 text-sm font-semibold text-[#ED7428] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
