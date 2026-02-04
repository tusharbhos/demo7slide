"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";

export default function Slide4Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showReloadPopup, setShowReloadPopup] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [formData, setFormData] = useState({
    answer: "",
    summary: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [infoPopup, setInfoPopup] = useState<{
    image: string;
  }>({
    image: "",
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("wasReloaded", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const wasReloaded = localStorage.getItem("wasReloaded");
    if (wasReloaded === "true") {
      setShowReloadPopup(true);
      localStorage.removeItem("wasReloaded");
    }

    const playVideoWithSound = () => {
      if (!videoRef.current) return;

      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.playsInline = true;

      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play with sound failed:", error);
          videoRef.current!.muted = true;
          videoRef.current!.play();
        });
      }
    };

    if (videoRef.current) {
      videoRef.current.onloadeddata = playVideoWithSound;
    }

    setTimeout(playVideoWithSound, 500);

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
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch((error) => {
        console.log("Play after start button failed:", error);
        videoRef.current!.muted = true;
        videoRef.current!.play();
      });
    }
  };

  const goToPreviousSlide = () => {
    router.push("/slide-4");
  };

  const goToNextSlide = () => {
    setShowFormPopup(true);
  };

  const handleSlideSelect = (slideNumber: number) => {
    if (slideNumber === 0) {
      router.push("/");
    } else if (slideNumber === 1) {
      router.push("/slide-4");
    } else if (slideNumber === 2) {
      router.push("/slide-6");
    } else {
      if (slideNumber > 4) {
        setShowFormPopup(true);
      } else {
        router.push(`/slide-${slideNumber}`);
      }
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.answer) {
      setSubmitMessage("Please select Yes or No!");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    const navigationTimeout = setTimeout(() => {
      setShowFormPopup(false);
      setFormData({ answer: "", summary: "" });
      setSubmitMessage("");
      router.push("/slide-3");
      setIsSubmitting(false);
    }, 3000);

    try {
      const response = await fetch(
        "https://agenticaicourseinpune.com/submit-form.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            answer: formData.answer,
            summary: formData.summary,
            timestamp: new Date().toISOString(),
            page: "slide-2",
          }),
        }
      );

      const result = await response.text();

      if (response.ok) {
        setSubmitMessage("Thank you! Your response has been recorded.");
      } else {
        setSubmitMessage(
          "Error submitting form. But continuing to next slide..."
        );
      }

      clearTimeout(navigationTimeout);

      setTimeout(() => {
        setShowFormPopup(false);
        setFormData({ answer: "", summary: "" });
        setSubmitMessage("");
        router.push("/slide-6");
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("Network error. Continuing to next slide...");
      clearTimeout(navigationTimeout);

      setTimeout(() => {
        setShowFormPopup(false);
        setFormData({ answer: "", summary: "" });
        setSubmitMessage("");
        router.push("/slide-6");
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowFormPopup(false);
    setFormData({ answer: "", summary: "" });
    setSubmitMessage("");
  };

  return (
    <div className="relative w-full h-full">
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

      {/* Form Popup */}
      {showFormPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl md:p-8">
            <div className="flex flex-col items-center text-center">
              <form onSubmit={handleFormSubmit} className="w-full">
                <div className="mb-6">
                  <label className="mb-4 block text-lg font-medium text-gray-700">
                    Is/are "approach to property" matching with your desires?
                  </label>

                  <div className="flex flex-col gap-3 mb-6">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3 hover:bg-gray-50 transition-all">
                      <input
                        type="radio"
                        name="answer"
                        value="Yes"
                        required
                        checked={formData.answer === "Yes"}
                        onChange={handleFormChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-medium">Yes</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3 hover:bg-gray-50 transition-all">
                      <input
                        type="radio"
                        name="answer"
                        value="No"
                        required
                        checked={formData.answer === "No"}
                        onChange={handleFormChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-medium">No</span>
                    </label>
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit & Continue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div className="fixed top-4 right-4 w-[110px] h-[70px] md:w-[130px] md:h-[90px] lg:w-[150px] lg:h-[110px] bg-black rounded-lg overflow-hidden shadow-lg z-40">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={showReloadPopup}
          className="w-full h-full object-cover"
        >
          <source src="/videos/S5.mp4" type="video/mp4" />
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

      {/* Title - Fixed at top with improved positioning */}
      <h2 className="maroon-gradient fixed text-l md:text-3xl font-bold px-4 top-6 left-4 md:top-8 md:left-8 z-40">
        COST &
        <br /> OWNERSHIP REALITY
      </h2>

      {/* Main Content Container - SCROLLABLE FOR MOBILE */}
      <div className="relative z-30 w-full h-full flex flex-col items-center justify-center px-4 py-8 md:py-0">
        {/* Mobile View: Scrollable container */}
        <div className="md:hidden w-full h-full overflow-y-auto py-20">
          <div className="flex flex-col items-center justify-start gap-6 w-full max-w-xs mx-auto pb-10">
            {/* Price Range Heading */}
            <h2 className="text-lg text-white text-left w-full mt-4">
              Price Range
            </h2>
            
            {/* Unit Type Buttons */}
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B1P1_50pct.webp",
                })
              }
              className="w-full py-3 px-4 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-sm shadow-md hover:bg-orange-500 hover:text-white transition active:scale-95"
            >
              2 BHK
            </button>
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B2P1_50pct.webp",
                })
              }
              className="w-full py-3 px-4 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-sm shadow-md hover:bg-orange-500 hover:text-white transition active:scale-95"
            >
              3 BHK
            </button>
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B3P1_50pct.webp",
                })
              }
              className="w-full py-3 px-4 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-sm shadow-md hover:bg-orange-500 hover:text-white transition active:scale-95"
            >
              3 BHK - Spacious
            </button>
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B4P1_50pct.webp",
                })
              }
              className="w-full py-3 px-4 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-sm shadow-md hover:bg-orange-500 hover:text-white transition active:scale-95"
            >
              4 BHK
            </button>

            

            {/* Single Button - Mandatory Charges */}
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B5P1_50pct.webp",
                })
              }
              className="w-full py-3 px-4 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-sm shadow-md hover:bg-orange-500 hover:text-white transition active:scale-95 mt-8"
            >
              Mandatory Charges
            </button>

            {/* Single Button - OnGoing Costs */}
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B6P1_50pct.webp",
                })
              }
              className="w-full py-3 px-4 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-sm shadow-md hover:bg-orange-500 hover:text-white transition active:scale-95"
            >
              OnGoing Costs
            </button>
          </div>
        </div>

        {/* Desktop View: Exactly like image.png */}
        <div className="hidden md:flex flex-col items-center justify-center gap-8 w-full max-w-6xl mx-auto">
          {/* Price Range Section */}
          <div className="flex flex-col items-center gap-6 w-full">
            <h2 className="text-white text-2xl text-left">
              Price Range
            </h2>
            <div className="flex items-center justify-center gap-6 w-full">
              <button
                onClick={() =>
                  setInfoPopup({
                    image: "assets/accounts/1/coveAi/popup/S4B1P1_50pct.webp",
                  })
                }
                className="py-3 px-8 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-lg shadow-md hover:bg-orange-500 hover:text-white transition hover:scale-105 min-w-[160px]"
              >
                2 BHK
              </button>
              <button
                onClick={() =>
                  setInfoPopup({
                    image: "assets/accounts/1/coveAi/popup/S4B2P1_50pct.webp",
                  })
                }
                className="py-3 px-8 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-lg shadow-md hover:bg-orange-500 hover:text-white transition hover:scale-105 min-w-[160px]"
              >
                3 BHK
              </button>
              <button
                onClick={() =>
                  setInfoPopup({
                    image: "assets/accounts/1/coveAi/popup/S4B3P1_50pct.webp",
                  })
                }
                className="py-3 px-8 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-lg shadow-md hover:bg-orange-500 hover:text-white transition hover:scale-105 min-w-[200px]"
              >
                3 BHK - Spacious
              </button>
              <button
                onClick={() =>
                  setInfoPopup({
                    image: "assets/accounts/1/coveAi/popup/S4B4P1_50pct.webp",
                  })
                }
                className="py-3 px-8 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-lg shadow-md hover:bg-orange-500 hover:text-white transition hover:scale-105 min-w-[160px]"
              >
                4 BHK
              </button>
            </div>
          </div>

          

          {/* Single Button - Mandatory Charges */}
          <div className="flex justify-center w-full mt-4">
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B5P1_50pct.webp",
                })
              }
              className="py-3 px-12 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-lg shadow-md hover:bg-orange-500 hover:text-white transition hover:scale-105 min-w-[300px]"
            >
              Mandatory Charges
            </button>
          </div>

          {/* Single Button - OnGoing Costs */}
          <div className="flex justify-center w-full">
            <button
              onClick={() =>
                setInfoPopup({
                  image: "assets/accounts/1/coveAi/popup/S4B6P1_50pct.webp",
                })
              }
              className="py-3 px-12 rounded-xl border-2 border-orange-500 bg-white text-orange-600 font-semibold text-lg shadow-md hover:bg-orange-500 hover:text-white transition hover:scale-105 min-w-[300px]"
            >
              OnGoing Costs
            </button>
          </div>
        </div>
      </div>

      {/* INFO POPUP - IMAGE ONLY WITH CLOSE BUTTON */}
      {infoPopup.image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl">
            {/* Image Container */}
            <div className="overflow-hidden rounded-lg shadow-2xl">
              <img
                src={infoPopup.image}
                alt="Information"
                className="w-full h-auto object-contain max-h-[80vh]"
              />
              {/* Close Button - Bottom Right */}
              <button
                onClick={() => setInfoPopup({ image: "" })}
                className="absolute right-0 bottom-0 p-3 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation
        currentSlide={5}
        onPrevious={goToPreviousSlide}
        onNext={goToNextSlide}
        onSlideSelect={handleSlideSelect}
      />
    </div>
  );
}