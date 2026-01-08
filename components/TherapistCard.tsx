import { Bricolage_Grotesque } from "next/font/google";

const bookCardFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function TherapistCard() {
  return (
    <div
      className="flex w-full flex-col lg:flex-row gap-4
  rounded-2xl
  border border-gray-300
  bg-white
  p-4 sm:p-5
  transition-all duration-300
  hover:-translate-y-1
  hover:shadow-lg"
    >
      {/* Avatar + Rating */}
      <div className="flex flex-row lg:flex-col items-center gap-3 lg:gap-2 shrink-0">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-yellow-400" />
        <div className="flex gap-1 text-gray-400 text-sm">★ ★ ★ ★ ★</div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-1 flex-col text-[#00373E] ${bookCardFont.className}`}
      >
        <h3 className="text-base sm:text-lg font-semibold">
          Name of the therapist
        </h3>

        <p className="font-medium text-sm sm:text-base">Area of expertise</p>

        <p className="text-sm font-normal">English, Hindi</p>
        <p className="text-sm font-normal">Exp: 12 years</p>

        {/* Price + Button */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-semibold whitespace-nowrap">Rs 3000 / session</p>

          <button
            className={`${bookCardFont.className}
    w-full sm:w-auto
    rounded-lg
    border border-[#00373E]
    px-8 py-1.5
    text-sm
    text-[#00373E]
    transition-all duration-300
    hover:bg-[#00373E]
    hover:text-white
    hover:scale-105
    active:scale-95
  `}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

