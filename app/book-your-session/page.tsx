import Header from "@/components/Header";
import dynamic from "next/dynamic";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import BookingListClient from "@/components/BookingListClient";
import { getDoctorsForBuild, getDepartments } from "@/lib/doctors";
import { serializeJsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/config";

const Footer = dynamic(() => import("@/components/Footer"));

const bookHeadingFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const bookBodyMediumFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500"],
});

export default async function Page() {
  const doctors = await getDoctorsForBuild();
  const departments = getDepartments(doctors);

  // Lets search engines see the roster as a structured list of profiles.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Therapists and psychiatrists at Hope Trust",
    numberOfItems: doctors.length,
    itemListElement: doctors.map((doc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/therapists/${doc.slug}/`,
      name: doc.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemList) }}
      />
      <Header />

      <main className="min-h-screen pt-20 bg-[#F6EFE8]">
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

          {/* Pre-booked appointment notice */}
          <div className="mx-auto mb-10 max-w-2xl rounded-2xl bg-[#00373E] px-6 py-5 text-white text-center">
            <p className="text-sm sm:text-base font-medium">All appointments are pre-booked.</p>
          </div>

          <BookingListClient doctors={doctors} departments={departments} />
        </section>
      </main>
      <Footer />
    </>
  );
}
