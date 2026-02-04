"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/slide-1");
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Image - Desktop */}
      <div className="hidden md:block absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/accounts/1/coveAi/desktop/common.png')",
          }}
        />
      </div>

      {/* Background Image - Mobile */}
      <div className="md:hidden absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/accounts/1/coveAi/mobile/common.png')",
          }}
        />
      </div>

      {/* Start Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button
          onClick={handleStart}
          className="bg-[#1D5B74] text-white text-lg md:text-xl font-medium px-8 py-3 md:px-12 md:py-4 rounded-lg border-2 border-white shadow-lg hover:bg-[#16475c] transition-colors"
        >
          Let&apos;s Start
        </button>
      </div>
    </div>
  );
}
