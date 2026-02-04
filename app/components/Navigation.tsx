"use client";

import Image from "next/image";

interface NavigationProps {
  currentSlide: number;
  onPrevious: () => void;
  onNext: () => void;
  onSlideSelect: (slide: number) => void;
}

export default function Navigation({
  currentSlide,
  onPrevious,
  onNext,
  onSlideSelect,
}: NavigationProps) {
  return (
    <div className="fixed  bottom-[-4px] left-0 w-full flex justify-center items-center z-50">
      
      {/* PREVIOUS BUTTON (hide on slide 1) */}
      {currentSlide > 1 ? (
        <button
          onClick={onPrevious}
          className="px-2 py-2 rounded flex items-center text-white"
        >
          <Image
            src="/assets/accounts/1/coveAi/popup/2.png"
            alt="Previous"
            width={50}
            height={50}
            className="mr-2"
          />
        </button>
      ) : (
        <div className="w-[50px]" />  // layout balance
      )}

      {/* SLIDE SELECT */}
      <select
        value={currentSlide}
        onChange={(e) => onSlideSelect(Number(e.target.value))}
        className="bg-white text-black px-3 py-2 border-2 rounded min-w-[200px]"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <option key={num} value={num}>
            Slide {num}: {getSlideName(num)}
          </option>
        ))}
      </select>

      {/* NEXT BUTTON (hide on slide 9) */}
      {currentSlide < 9 ? (
        <button
          onClick={onNext}
          className="px-2 py-2 rounded flex items-center text-white"
        >
          <Image
            src="/assets/accounts/1/coveAi/popup/1.png"
            alt="Next"
            width={50}
            height={50}
            className="ml-2"
          />
        </button>
      ) : (
        <div className="w-[50px]" /> // layout balance
      )}
    </div>
  );
}

function getSlideName(num: number): string {
  const names: Record<number, string> = {
    1: "Welcome",
    2: "Home Exists for You",
    3: "Location & Daily Life",
    4: "Homes are offered",
    5: "Cost & Ownership Reality",
    6: "Works For Living",
    7: "Before Deciding",
    8: "Home is Best Suited",
    9: "Final Form",
  };
  return names[num] || `Slide ${num}`;
}
