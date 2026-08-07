/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/BookingPage.jsx
 * DESCRIPTION: Flights booking step-by-step layout assembler page.
 * ============================================================================
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Home } from "lucide-react";

// Global layout wrappers (Unmodified)
import Header from "../../../common/Header";
import Footer from "../../../common/Footer";

// Step forms (organically renamed to remove redundant "Flight" prefixes)
import BookingSteps from "./components/BookingSteps";
import BookingInfo from "./components/BookingInfo";
import BookingSeat from "./components/BookingSeat";
import BookingPersonalize from "./components/BookingPersonalize";
import BookingPayment from "./components/BookingPayment";
import BookingSummary from "./components/BookingSummary";
import FareSummary from "./components/FareSummary";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback default flight configuration
  const defaultFlight = {
    id: 1,
    logo: "https://images.kiwi.com/airlines/64/6E.png",
    airline: "IndiGo",
    code: "6E-204",
    depTime: "06:00",
    arrTime: "08:10",
    duration: "2h 10m",
    stops: "Non-stop",
    price: "₹3,499",
    save: "Save ₹500",
    flexi: "Flexi ₹3,399",
    business: "Business ₹7,797",
    badge: "Cheapest"
  };

  // Retrieve parameters passed from the flight list page
  const flight = location.state?.flight || defaultFlight;
  const fare = location.state?.fare || { title: "Economy Saver", price: 3499 };

  // Stepper state: 1 = Info, 2 = Seat, 3 = Personalize, 4 = Payment
  const [step, setStep] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [addonsData, setAddonsData] = useState({
    meal: "none",
    addons: [],
    insurance: false,
    totalAdditional: 0
  });

  // Success dialog popup state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Dynamic Fare Calculations
  const basePrice = fare.price || 3499;
  const taxes = Math.round(basePrice * 0.12); // ~12% Taxes & Fees
  const additionalAmount = addonsData.totalAdditional;
  const totalAmount = basePrice + taxes + additionalAmount;

  // Setup history interception on mount
  React.useEffect(() => {
    // Push the first step into history state so back button has something to pop
    window.history.replaceState({ step: 1 }, "");

    const handlePopState = (event) => {
      if (event.state && typeof event.state.step === "number") {
        setStep(event.state.step);
      } else {
        navigate("/flights");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Custom step transition helper that pushes state to browser history
  const goToStep = (targetStep) => {
    setStep(targetStep);
    window.history.pushState({ step: targetStep }, "");
  };

  const handlePay = () => {
    navigate("/payment", {
      state: {
        bookingType: "flight",
        flight,
        fare,
        basePrice,
        taxes,
        totalAmount
      }
    });
  };

  const handleReturnHome = () => {
    setIsSuccessOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between font-sans">

      {/* 1. Global Header (Unmodified) */}
      <Header />

      {/* 2. Main Page Layout Wrapper */}
      <div className="max-w-[1393px] mx-auto px-4 py-6 w-full flex-grow">

        {/* Step Navigation Indicator */}
        <div className="mb-6">
          <BookingSteps currentStep={step} />
        </div>

        {/* Form and Summary grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_395px] xl:grid-cols-[970px_395px] gap-[28px] items-start">

          {/* Left Column - Stepper Form Console */}
          <div className="w-full space-y-6">

            {step === 1 && (
              <BookingInfo
                onContinue={() => goToStep(2)}
              />
            )}

            {step === 2 && (
              <BookingSeat
                onContinue={() => goToStep(3)}
                onSeatSelect={setSelectedSeat}
              />
            )}

            {step === 3 && (
              <BookingPersonalize
                onContinue={() => goToStep(4)}
                onAddonsUpdate={setAddonsData}
              />
            )}

            {step === 4 && (
              <BookingPayment
                flight={flight}
                selectedFare={fare}
                totalAmount={totalAmount}
                onPay={handlePay}
                selectedSeat={selectedSeat}
                addonsData={addonsData}
                basePrice={basePrice}
                taxes={taxes}
              />
            )}

          </div>

          {/* Right Column - Booking Summary & Fare Summary separated */}
          <div className="w-full space-y-6">
            <BookingSummary flight={flight} />

            <FareSummary
              basePrice={basePrice}
              taxes={taxes}
              additionalAmount={additionalAmount}
              totalAmount={totalAmount}
            />
          </div>

        </div>

      </div>

      {/* 3. Global Footer (Unmodified) */}
      <Footer />

      {/* SUCCESS POPUP MODAL DIALOG */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full text-center shadow-2xl border border-gray-100 animate-scale-up">

            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4.5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-extrabold text-lg text-gray-900 mb-1.5">Booking Confirmed!</h3>
            <p className="text-xs text-gray-400 font-bold mb-6">
              Your ticket for flight <span className="text-gray-700">{flight.code}</span> has been successfully booked. Ticket summary and confirmation email sent to you!
            </p>

            <button
              onClick={handleReturnHome}
              className="w-full bg-[#E11D48] hover:bg-red-750 text-white font-extrabold py-3 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
