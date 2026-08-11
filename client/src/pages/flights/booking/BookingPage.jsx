/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/BookingPage.jsx
 * DESCRIPTION: Flights booking step-by-step layout assembler page.
 * ============================================================================
 */

import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Home } from "lucide-react";
import axios from "axios";

// Global layout wrappers (Unmodified)
import Header from "../../../common/Header";
import Footer from "../../../common/Footer";

// Step forms (organically renamed to remove redundant "Flight" prefixes)
import BookingSteps from "./components/BookingSteps";
import BookingInfo from "./components/BookingInfo";
import BookingSeat from "./components/BookingSeat";
import BookingPersonalize from "./components/BookingPersonalize";
import BookingSummary from "./components/BookingSummary";
import FareSummary from "./components/FareSummary";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract passenger counts from URL query params or state
  const adultsCount = parseInt(searchParams.get("adults") || location.state?.adults || 1, 10);
  const childrenCount = parseInt(searchParams.get("children") || location.state?.children || 0, 10);
  const infantsCount = parseInt(searchParams.get("infants") || location.state?.infants || 0, 10);

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

  // Save active booking state to sessionStorage whenever location.state is available
  React.useEffect(() => {
    if (location.state?.flight) {
      try {
        sessionStorage.setItem("flyanytrip_active_booking", JSON.stringify(location.state));
      } catch (err) {
        console.warn("Could not save booking state to sessionStorage:", err);
      }
    }
  }, [location.state]);

  // Recover state from sessionStorage if location.state is empty after refresh
  const getSavedBookingState = () => {
    if (location.state?.flight) return location.state;
    try {
      const saved = sessionStorage.getItem("flyanytrip_active_booking");
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn("Could not read booking state from sessionStorage:", err);
    }
    return null;
  };

  const savedState = getSavedBookingState();

  // Retrieve parameters passed from the flight list page or restored from session
  const [activeFlightState, setActiveFlightState] = useState(() => savedState?.flight || defaultFlight);
  const [activeFareState, setActiveFareState] = useState(() => savedState?.fare || { title: "Economy Saver", price: 3499 });

  const flight = savedState?.flight || activeFlightState;
  const fare = savedState?.fare || activeFareState;
  const traceId = location.state?.traceId || savedState?.traceId || searchParams.get("traceId");
  const resultIndex = location.state?.resultIndex || savedState?.resultIndex || searchParams.get("resultIndex");

  // Fetch live Fare Quote if state is missing on refresh but URL traceId/resultIndex exist
  React.useEffect(() => {
    const restoreFromFareQuote = async () => {
      const activeTrace = searchParams.get("traceId");
      const activeResIdx = searchParams.get("resultIndex");
      if (!savedState?.flight && activeTrace && activeResIdx) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
          const res = await axios.post(`${API_BASE_URL}/flights/fare-quote`, { TraceId: activeTrace, ResultIndex: activeResIdx });
          if (res.data?.responseData?.Response?.Results) {
            const opt = res.data.responseData.Response.Results;
            const segs = opt.Segments?.[0] || [];
            const fLeg = segs[0] || {};
            const lLeg = segs[segs.length - 1] || fLeg;
            const aName = fLeg.Airline?.AirlineName || "Airline";
            const aCode = fLeg.Airline?.AirlineCode || "IX";
            const fNum = fLeg.Airline?.FlightNumber || "";
            const priceVal = opt.Fare?.PublishedFare || 0;

            const formatTime = (iso) => (iso ? iso.split("T")[1]?.substring(0, 5) || "--:--" : "--:--");
            const restoredFlight = {
              id: activeResIdx,
              logo: `https://images.kiwi.com/airlines/64/${aCode.toUpperCase()}.png`,
              airline: aName,
              code: `${aCode}-${fNum}`,
              depTime: formatTime(fLeg.Origin?.DepTime),
              arrTime: formatTime(lLeg.Destination?.ArrTime),
              fromCode: fLeg.Origin?.AirportCode || searchParams.get("from") || "DEL",
              toCode: lLeg.Destination?.AirportCode || searchParams.get("to") || "BOM",
              duration: (() => {
                const totalMins = fLeg.Duration || 120;
                const h = Math.floor(totalMins / 60);
                const m = totalMins % 60;
                return m === 0 ? `${h}h` : `${h}h ${m}m`;
              })(),
              stops: segs.length === 1 ? "Non-stop" : `${segs.length - 1} Stop`,
              price: `₹${Math.round(priceVal).toLocaleString()}`,
              rawOption: opt
            };

            const restoredFare = {
              title: opt.SupplierFareClass || opt.FareClassification?.Type || "Regular",
              price: priceVal,
              rawOption: opt
            };

            setActiveFlightState(restoredFlight);
            setActiveFareState(restoredFare);

            sessionStorage.setItem("flyanytrip_active_booking", JSON.stringify({
              flight: restoredFlight,
              fare: restoredFare,
              traceId: activeTrace,
              resultIndex: activeResIdx
            }));
          }
        } catch (err) {
          console.error("Error restoring flight from live fare quote:", err);
        }
      }
    };

    restoreFromFareQuote();
  }, [searchParams, savedState]);

  // Stepper state: 1 = Info, 2 = Seat, 3 = Personalize, 4 = Payment
  const [step, setStep] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [seatPrice, setSeatPrice] = useState(0);
  const [addonsData, setAddonsData] = useState({
    meal: "none",
    mealObj: null,
    addons: [],
    insurance: false,
    totalAdditional: 0
  });

  // SSR Data state from API
  const [ssrData, setSsrData] = useState(null);
  const [loadingSSR, setLoadingSSR] = useState(false);

  // Fetch live SSR data ONCE on mount per traceId/resultIndex
  React.useEffect(() => {
    let isMounted = true;
    const fetchSSRData = async () => {
      const activeTraceId = traceId || flight.rawOption?.TraceId;
      const activeResultIndex = resultIndex || flight.rawOption?.ResultIndex;
      if (!activeTraceId || !activeResultIndex) return;

      // Avoid re-fetching if SSR data is already cached
      if (ssrData) return;

      try {
        setLoadingSSR(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const res = await axios.post(`${API_BASE_URL}/flights/ssr`, { TraceId: activeTraceId, ResultIndex: activeResultIndex });
        if (isMounted && res.data?.responseData?.Response) {
          setSsrData(res.data.responseData.Response);
        }
      } catch (err) {
        console.error("Error fetching live SSR options:", err);
      } finally {
        if (isMounted) setLoadingSSR(false);
      }
    };

    fetchSSRData();
    return () => {
      isMounted = false;
    };
  }, [traceId, resultIndex]);

  // Success dialog popup state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Dynamic Fare Calculations from exact API Response
  const rawFareObj = location.state?.fare?.rawOption?.Fare || flight.rawOption?.Fare;
  const pubFare = Math.round(rawFareObj?.PublishedFare || fare.price || 3499);
  const basePrice = Math.round(rawFareObj?.BaseFare || pubFare * 0.7);
  const taxes = pubFare - basePrice; // Exact Tax & Fees from API
  const additionalAmount = addonsData.totalAdditional + seatPrice;
  const totalAmount = pubFare + additionalAmount;

  // Setup history interception on mount
  React.useEffect(() => {
    // Push the first step into history state so back button has something to pop
    window.history.replaceState({ step: 1 }, "");

    const handlePopState = (event) => {
      if (event.state && typeof event.state.step === "number") {
        setStep(event.state.step);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/flights");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Custom step transition helper that pushes state to browser history and scrolls smoothly to top
  const goToStep = (targetStep) => {
    setStep(targetStep);
    window.history.pushState({ step: targetStep }, "");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                adultsCount={adultsCount}
                childrenCount={childrenCount}
                infantsCount={infantsCount}
              />
            )}

            {step === 2 && (
              <BookingSeat
                onContinue={() => goToStep(3)}
                onSeatSelect={setSelectedSeat}
                onSeatPriceSelect={setSeatPrice}
                ssrData={ssrData}
                loadingSSR={loadingSSR}
              />
            )}

            {step === 3 && (
              <BookingPersonalize
                onContinue={handlePay}
                onAddonsUpdate={setAddonsData}
                ssrData={ssrData}
                loadingSSR={loadingSSR}
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
