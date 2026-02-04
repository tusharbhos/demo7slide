"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navigation from "../components/Navigation";

export default function Slide1Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showReloadPopup, setShowReloadPopup] = useState(false);

  useEffect(() => {
    // Check if page was reloaded
    const handleBeforeUnload = () => {
      localStorage.setItem("wasReloaded", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check on mount if page was reloaded
    const wasReloaded = localStorage.getItem("wasReloaded");
    if (wasReloaded === "true") {
      setShowReloadPopup(true);
      localStorage.removeItem("wasReloaded");
    }

    // Auto-play video with sound in top-right
    const playVideoWithSound = () => {
      if (!videoRef.current) return;

      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.playsInline = true;

      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play with sound failed, trying muted:", error);
          videoRef.current!.muted = true;
          videoRef.current!.play();
        });
      }
    };

    if (videoRef.current) {
      videoRef.current.onloadeddata = playVideoWithSound;
    }

    setTimeout(playVideoWithSound, 500);

    // Add click to unmute if muted
    const handlePageClick = () => {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
      }
    };

    document.addEventListener("click", handlePageClick);

    return () => {
      document.removeEventListener("click", handlePageClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleStartPresentation = () => {
    setShowReloadPopup(false);
    // Start video with sound
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch((error) => {
        console.log("Play after start button failed:", error);
        // Try muted if direct play fails
        videoRef.current!.muted = true;
        videoRef.current!.play();
      });
    }
  };

  const goToPreviousSlide = () => {
    router.push("/");
  };

  const goToNextSlide = () => {
    router.push("/slide-2");
  };

  const handleSlideSelect = (slideNumber: number) => {
    if (slideNumber === 0) {
      router.push("/");
    } else if (slideNumber === 1) {
      router.push("/slide-1");
    } else {
      router.push(`/slide-${slideNumber}`);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Reload Confirmation Popup */}
      {showReloadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full mx-auto shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Are you sure?
              </h2>

              <div className="flex gap-4 w-full">
                <button
                  onClick={handleStartPresentation}
                  className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Container - Top Right */}
      <div className="fixed top-4 right-4 w-[110px] h-[70px] md:w-[130px] md:h-[90px] lg:w-[150px] lg:h-[110px] bg-black rounded-lg overflow-hidden shadow-lg z-40">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={showReloadPopup}
          className="w-full h-full object-cover"
        >
          <source src="/videos/S1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Background */}
      <div className="md:hidden absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/accounts/1/coveAi/mobile/common.png')",
          }}
        />
      </div>

      <div className="hidden md:block absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/accounts/1/coveAi/desktop/common.png')",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div className="flex flex-col items-center gap-6 md:gap-8 max-w-2xl">
          {/* Text Content (from image) */}
          <div className="w-full text-left mb-4 md:mb-6 bg-white border p-4 border-orange-500">
            <div className="flex items-start gap-3">
              {/* Number */}
              <div className="text-orange-500 text-5xl md:text-6xl font-bold leading-none">
                1
              </div>

              {/* Text */}
              <div className="text-gray-900 text-sm md:text-base tracking-wide">
                <div className="mb-1">
                  <span className="font-medium">KEY - </span>
                  <span className="font-bold">FAMILY ORIENTED HOMES</span>
                </div>

                <div className="mb-1">
                  <span className="font-medium">LOCATION - </span>
                  <span className="font-bold">WEST PUNE</span>
                </div>

                <div className="mb-1">
                  <span className="font-medium">HIGHLIGHT - </span>
                  <span className="font-bold">
                    ESTABLISHED RESIDENTIAL AREA
                  </span>
                </div>

                <div className="mb-1">RERA -</div>
                <div className="mb-1">DEVELOPER -</div>
                <div>PROJECT NAME -</div>

                {/* Orange line */}
                <div className="mt-2 h-[2px] w-32 bg-orange-500"></div>
              </div>
            </div>
          </div>

          <Image
            src="/assets/accounts/1/coveAi/popup/Use.gif"
            alt="Use Animation"
            width={350}
            height={200}
            className="w-64 md:w-80"
            unoptimized
          />
        </div>
      </div>

      {/* Navigation */}
      <Navigation
        currentSlide={1}
        onPrevious={goToPreviousSlide}
        onNext={goToNextSlide}
        onSlideSelect={handleSlideSelect}
      />
    </div>
  );
}
