"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";

export default function Slide9Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    slot1: "",
    slot2: "",
  });
  
  const [showReloadPopup, setShowReloadPopup] = useState(false);

  useEffect(() => {
    // Reload detection logic
    const handleBeforeUnload = () => {
      localStorage.setItem("wasReloaded", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const wasReloaded = localStorage.getItem("wasReloaded");
    if (wasReloaded === "true") {
      setShowReloadPopup(true);
      localStorage.removeItem("wasReloaded");
    }

    // Video auto-play logic
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

    // Set minimum date to today
    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);
    const minDate = now.toISOString().slice(0, 10);

    // Set min for datetime inputs
    const datetimeInputs = document.querySelectorAll(
      'input[type="datetime-local"]'
    );
    datetimeInputs.forEach((input: any) => {
      input.min = minDateTime;
    });

    // Set min for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input: any) => {
      input.min = minDate;
    });

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

  const goToPreviousSlide = () => router.push("/slide-8");
  const handleSlideSelect = (slideNumber: number) => {
    if (slideNumber === 0) router.push("/");
    else router.push(`/slide-${slideNumber}`);
  };

  const handleYes = () => setCurrentStep(2);
  const handleNo = () => setShowConfirmation(true);
  const handleCancelLeave = () => setShowConfirmation(false);
  const handleConfirmLeave = () =>
    (window.location.href = "https://paranjape.vercel.app/");

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    if (currentStep === 2 && selectedOptions.length === 0) {
      alert("⚠ Please select at least one option");
      return;
    }

    if (currentStep === 3) {
      // Validation for Step 3 (Date Selection)
      if (!formData.slot1) {
        alert("⚠ Please select Date & Time for Slot 1");
        return;
      }
    }

    if (currentStep === 4) {
      // Validation for Step 4 (Personal Details)
      if (!formData.name.trim()) {
        alert("⚠ Please enter your name");
        return;
      }

      if (!formData.email.trim()) {
        alert("⚠ Please enter your email");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("⚠ Please enter a valid email address");
        return;
      }

      if (!formData.phone.trim()) {
        alert("⚠ Please enter your phone number");
        return;
      }

      // Phone number validation (10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
        alert("⚠ Please enter a valid 10-digit phone number");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Final Form Data:", formData);
    console.log("Selected options:", selectedOptions);

    // Show success message
    setShowSuccess(true);

    // Reset form and go back to Step 1 after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentStep(1);
      setFormData({
        name: "",
        email: "",
        phone: "",
        slot1: "",
        slot2: "",
      });
      setSelectedOptions([]);
    }, 5000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/");
  };

  const options = [
    "Elevation 3D",
    "About Developer",
    "Specific Unit Details",
    "Balcony View",
    "Infrastructure Details",
    "EMI / Finance Support",
    "Past Customer Testimonials",
    "Current Development Photos",
    "Key USPs + Highlights",
  ];

  return (
    <div className="relative w-full h-screen">
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

      {/* Video Container - TOP RIGHT CORNER */}
      <div className="fixed top-4 right-4 w-[110px] h-[70px] md:w-[130px] md:h-[90px] lg:w-[150px] lg:h-[110px] bg-black rounded-lg overflow-hidden shadow-lg z-40">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={showReloadPopup}
          className="w-full h-full object-cover"
        >
          <source src="/videos/S9.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/accounts/1/coveAi/popup/common.png')",
          }}
        />
      </div>

      {/* Form Container */}
      <div className="relative z-10 pt-8 h-full flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[75vh] overflow-y-auto p-6">
          {/* Step Indicator */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  currentStep >= step ? "bg-orange-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="text-center py-8">
              <h2 className="text-xl md:text-2xl font-bold mb-8">
                Do you think this property matches with your desire?
              </h2>
              <div className="flex justify-center gap-6">
                <button
                  onClick={handleYes}
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-orange-700 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleNo}
                  className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg text-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - Options Selection */}
          {currentStep === 2 && (
            <div className="p-4 border border-black rounded-lg">
              <h2 className="text-xl font-bold mb-6 text-center">
                Please select what more you would like to explore
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="w-5 h-5 mr-3"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Date & Time Selection */}
          {currentStep === 3 && (
            <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-6 text-center">
                📅 Select Date & Time
              </h2>

              <div className="space-y-6">
                {/* Presentation Slot 1 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-orange-700">
                    Presentation Slot 1
                  </h3>
                  <label className="block mb-2 font-medium">
                    Select Date & Time (Slot 1){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="slot1"
                    value={formData.slot1}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                {/* Presentation Slot 2 (Optional) */}
                <div>
                  <label className="block mb-2 font-medium">
                    Select 2nd Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="slot2"
                    value={formData.slot2}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4 - Personal Details */}
          {currentStep === 4 && (
            <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-6 text-center">
                👤 Enter Your Details
              </h2>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block mb-2 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block mb-2 font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block mb-2 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Please enter 10-digit number without country code
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4 text-center">
              Are you sure you want to leave?
              <br />
              You will be redirected.
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleCancelLeave}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLeave}
                className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center">
            <div className="mb-4">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">
                Thank you for your booking. We've scheduled your meeting as
                requested.
              </p>
            </div>

            <p className="text-gray-600 mb-4">
              Our representative will contact you shortly to confirm the
              details.
            </p>
            <button
              onClick={handleSuccessClose}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navigation
        currentSlide={9}
        onPrevious={goToPreviousSlide}
        onNext={() => {}}
        onSlideSelect={handleSlideSelect}
      />
    </div>
  );
}