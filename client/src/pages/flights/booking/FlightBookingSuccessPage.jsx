/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/FlightBookingSuccessPage.jsx
 * DESCRIPTION: Flight Booking Success Page matching the Figma layout exactly.
 *              Displays gradient hero banner, flight/passenger details, payment
 *              summary, refund status, interactive actions, and star ratings.
 * ============================================================================
 */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  Copy,
  Plane,
  User,
  CreditCard,
  RefreshCw,
  Star,
  Download,
  Mail,
  Globe,
  Settings,
  Phone,
  ArrowRight
} from "lucide-react";

import Header from "../../../common/Header";
import Footer from "../../../common/Footer";

export default function FlightBookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Figma design default configurations
  const defaultFlight = {
    airline: "IndiGo",
    code: "6E-204",
    class: "Economy Saver",
    logo: "https://images.kiwi.com/airlines/64/6E.png",
    route: "New Delhi (DEL) → Mumbai (BOM)",
    date: "15 Dec 2024 · Sunday",
    departure: "06:00 — Terminal 2, Gate 14B",
    arrival: "08:10 — Terminal 1, Gate 22A",
    duration: "2 hours 10 minutes · Non-Stop"
  };

  const defaultPassenger = {
    name: "Rahul Sharma (Adult)",
    seat: "15C — Window · Economy",
    baggage: "7 kg Cabin Only (Saver Fare)",
    meal: "Vegetarian"
  };

  const defaultPayment = {
    baseFare: 3499,
    taxes: 420,
    totalPaid: 3919,
    method: "HDFC Credit Card · XXXX 4521",
    transactionId: "TXN240215094823"
  };

  const defaultRefund = {
    amount: "₹0 (not requested)",
    method: "Original payment method",
    expectedBy: "5–7 business days"
  };

  // 2. Hydrate states from navigation context, or fall back to Figma design defaults
  const flight = {
    ...defaultFlight,
    ...(location.state?.flight || {}),
    route: location.state?.flight?.route || defaultFlight.route,
    date: location.state?.flight?.date || defaultFlight.date
  };

  const passenger = {
    ...defaultPassenger,
    ...(location.state?.passenger || {})
  };

  const payment = {
    ...defaultPayment,
    baseFare: location.state?.basePrice || defaultPayment.baseFare,
    taxes: location.state?.taxes || defaultPayment.taxes,
    totalPaid: location.state?.totalAmount || defaultPayment.totalPaid
  };

  const refund = {
    ...defaultRefund,
    ...(location.state?.refund || {})
  };

  const pnr = location.state?.pnr || "FLY8K2M4";
  const userEmail = location.state?.email || "user@email.com";

  // 3. Interactive Component States
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [actionStatus, setActionStatus] = useState("");

  const handleCopyPNR = () => {
    navigator.clipboard.writeText(pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showStatus = (message) => {
    setActionStatus(message);
    setTimeout(() => setActionStatus(""), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between font-sans">
      {/* Top Header Section */}
      <Header />

      {/* Main Page Layout Wrapper */}
      <main className="max-w-[1395px] mx-auto px-4 py-7 w-full flex-grow flex flex-col gap-[26px] font-quicksand">
        {/* Dynamic Action Alerts */}
        {actionStatus && (
          <div className="fixed top-24 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-lg border border-gray-800 z-50 flex items-center gap-3 animate-fade-in-up text-sm font-semibold">
            <Check className="w-5 h-5 text-emerald-450" />
            <span>{actionStatus}</span>
          </div>
        )}

        {/* 1. Large Gradient Royal Blue "Flight Booked!" Banner Card */}
        <section className="w-full bg-gradient-to-br from-[#155DFC] to-[#193CB8] rounded-[22.5px] p-[37.5px] text-white flex flex-col items-center justify-center relative overflow-hidden shadow-xs min-h-[358px]">
          {/* Background Image: Flight Attendant (Left) */}
          <img
            src="/assets/booking/flight_attendant.png"
            alt="Flight Attendant"
            className="absolute left-0 bottom-0 h-full w-auto object-contain pointer-events-none opacity-20 sm:opacity-40 lg:opacity-100 z-0 select-none"
          />

          {/* Background Image: Airplane Flying (Right) */}
          <img
            src="/assets/booking/airplane_flying.png"
            alt="Airplane Flying"
            className="absolute right-0 bottom-0 h-[60%] sm:h-[80%] lg:h-full w-auto object-contain pointer-events-none opacity-30 sm:opacity-50 lg:opacity-100 z-0 select-none"
          />

          {/* Content (Overlay z-10) */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-[500px]">
            {/* Double Circle Check Icon */}
            <div className="w-[75px] h-[75px] rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mb-[15px] shadow-inner">
              <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center shadow-xs">
                <Check className="w-6 h-6 text-[#155DFC]" strokeWidth={3.5} />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-[33.75px] font-bold leading-[37.5px] mt-[15px]">
              Flight Booked!
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] font-medium opacity-90 mt-[7.5px] mb-[22.5px] leading-[22.5px]">
              Your seats are confirmed. Have a great flight!
            </p>

            {/* PNR Code Pill */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-[15px] p-[15px] flex items-center justify-between gap-[15px] w-[260px] h-[77px]">
              <div className="flex flex-col text-left justify-center">
                <span className="text-[11.25px] font-semibold text-white/80 uppercase tracking-wider">
                  PNR Number
                </span>
                <span className="text-[22.5px] font-bold font-jetbrains tracking-wider text-white">
                  {pnr}
                </span>
              </div>
              <button
                onClick={handleCopyPNR}
                className="bg-white/25 hover:bg-white/40 active:scale-95 transition-all border border-white/20 rounded-[13.375px] py-[7.5px] px-[11.25px] flex items-center gap-[5.625px] text-white text-[11.25px] font-bold cursor-pointer"
              >
                <Copy className="w-[11.25px] h-[11.25px]" />
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Confirmation Email footer */}
            <p className="text-[11.25px] font-medium opacity-80 mt-[15px]">
              Confirmation sent to <span className="underline font-semibold">{userEmail}</span>
            </p>
          </div>
        </section>

        {/* 2. Grid Layout: Left Cards vs. Right Action Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] gap-[22.5px] items-start w-full">
          
          {/* Left Column (Flight Details, Passenger Details, Payment Summary, Refund Status) */}
          <div className="flex flex-col gap-[15px] w-full">
            
            {/* A. Flight Details Card */}
            <div className="bg-white rounded-[20px] border border-gray-200/80 p-[20px] flex flex-col gap-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
              {/* Heading */}
              <div className="flex items-center gap-[8px] border-b border-gray-100 pb-[12px]">
                <div className="w-[26px] h-[26px] rounded-full bg-[#FFD9D9] text-[#FE2C1C] flex items-center justify-center flex-shrink-0">
                  <Plane className="w-[13px] h-[13px] transform rotate-45" />
                </div>
                <h3 className="text-[16.875px] font-bold text-gray-900">
                  Flight Details
                </h3>
              </div>

              {/* Data Rows */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Flight</span>
                  <span className="text-[16px] font-semibold text-gray-800">
                    {flight.airline} {flight.code} · {flight.class}
                  </span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Route</span>
                  <span className="text-[16px] font-semibold text-gray-800">{flight.route}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Date</span>
                  <span className="text-[16px] font-semibold text-gray-800">{flight.date}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Departure</span>
                  <span className="text-[16px] font-semibold text-gray-800">{flight.departure}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Arrival</span>
                  <span className="text-[16px] font-semibold text-gray-800">{flight.arrival}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] last:border-b-0">
                  <span className="text-[14px] font-semibold text-gray-400">Duration</span>
                  <span className="text-[16px] font-semibold text-gray-800">{flight.duration}</span>
                </div>
              </div>
            </div>

            {/* B. Passenger Details Card */}
            <div className="bg-white rounded-[20px] border border-gray-200/80 p-[18.75px] flex flex-col gap-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
              {/* Heading */}
              <div className="flex items-center gap-[8px] border-b border-gray-100 pb-[12px]">
                <div className="w-[26px] h-[26px] rounded-full bg-[#FFD9D9] text-[#FE2C1C] flex items-center justify-center flex-shrink-0">
                  <User className="w-[13px] h-[13px]" />
                </div>
                <h3 className="text-[16.875px] font-bold text-gray-900">
                  Passenger Details
                </h3>
              </div>

              {/* Data Rows */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Passenger</span>
                  <span className="text-[16px] font-semibold text-gray-800">{passenger.name}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Seat</span>
                  <span className="text-[16px] font-semibold text-gray-800">{passenger.seat}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Baggage</span>
                  <span className="text-[16px] font-semibold text-gray-800">{passenger.baggage}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] last:border-b-0">
                  <span className="text-[14px] font-semibold text-gray-400">Meal</span>
                  <span className="text-[16px] font-semibold text-gray-800">{passenger.meal}</span>
                </div>
              </div>
            </div>

            {/* C. Payment Summary Card */}
            <div className="bg-white rounded-[20px] border border-gray-200/80 p-[18.75px] flex flex-col gap-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
              {/* Heading */}
              <div className="flex items-center gap-[8px] border-b border-gray-100 pb-[12px]">
                <div className="w-[26px] h-[26px] rounded-full bg-[#FFD9D9] text-[#FE2C1C] flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-[13px] h-[13px]" />
                </div>
                <h3 className="text-[16.875px] font-bold text-gray-900">
                  Payment Summary
                </h3>
              </div>

              {/* Data Rows */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Base Fare</span>
                  <span className="text-[16px] font-semibold text-gray-800">₹{payment.baseFare.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Taxes & Fees</span>
                  <span className="text-[16px] font-semibold text-gray-800">₹{payment.taxes.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-bold text-gray-800">Total Paid</span>
                  <span className="text-[18px] font-extrabold text-[#FE2C1C]">
                    ₹{payment.totalPaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-gray-100/70">
                  <span className="text-[14px] font-semibold text-gray-400">Payment Method</span>
                  <span className="text-[16px] font-semibold text-gray-800">{payment.method}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] last:border-b-0">
                  <span className="text-[14px] font-semibold text-gray-400">Transaction ID</span>
                  <span className="text-[16px] font-semibold text-gray-800 font-jetbrains">{payment.transactionId}</span>
                </div>
              </div>
            </div>

            {/* D. Refund Status (Post-Cancellation) Card */}
            <div className="bg-white rounded-[20px] border border-gray-200/80 p-[18.75px] flex flex-col gap-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
              {/* Heading */}
              <div className="flex items-center gap-[8px] border-b border-gray-100 pb-[12px]">
                <div className="w-[26px] h-[26px] rounded-full bg-[#FFD9D9] text-[#FE2C1C] flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-[13px] h-[13px]" />
                </div>
                <h3 className="text-[16.875px] font-bold text-gray-900">
                  Refund Status (Post-Cancellation)
                </h3>
              </div>

              {/* Stepper Steps UI */}
              <div className="relative py-4 px-2">
                <div className="flex items-start justify-between w-full relative z-10">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-[30px] h-[30px] rounded-full bg-[#E53935] text-white flex items-center justify-center font-bold text-[14px] shadow-sm z-10">
                      ✓
                    </div>
                    <span className="text-[11.25px] font-bold text-center text-gray-800 mt-2 leading-[14px] max-w-[80px]">
                      Cancellation Requested
                    </span>
                  </div>

                  {/* Divider Line 1 */}
                  <div className="h-[2px] bg-[#E53935] flex-grow mt-[15px] -mx-4"></div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-[30px] h-[30px] rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold text-[11.25px] shadow-xs z-10">
                      2
                    </div>
                    <span className="text-[11.25px] font-semibold text-center text-gray-400 mt-2 leading-[14px] max-w-[80px]">
                      Provider Confirmation
                    </span>
                  </div>

                  {/* Divider Line 2 */}
                  <div className="h-[2px] bg-gray-200 flex-grow mt-[15px] -mx-4"></div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-[30px] h-[30px] rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold text-[11.25px] shadow-xs z-10">
                      3
                    </div>
                    <span className="text-[11.25px] font-semibold text-center text-gray-400 mt-2 leading-[14px] max-w-[80px]">
                      Refund Initiated
                    </span>
                  </div>

                  {/* Divider Line 3 */}
                  <div className="h-[2px] bg-gray-200 flex-grow mt-[15px] -mx-4"></div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-[30px] h-[30px] rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold text-[11.25px] shadow-xs z-10">
                      4
                    </div>
                    <span className="text-[11.25px] font-semibold text-center text-gray-400 mt-2 leading-[14px] max-w-[80px]">
                      Refund Credited
                    </span>
                  </div>
                </div>
              </div>

              {/* Steps Info Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[15px] pt-[15px] border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-[11.25px] flex flex-col text-left">
                  <span className="text-[11.25px] text-gray-500 font-semibold mb-1">
                    Refund Amount
                  </span>
                  <span className="text-[13.125px] text-gray-800 font-bold">
                    {refund.amount}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-[11.25px] flex flex-col text-left">
                  <span className="text-[11.25px] text-gray-500 font-semibold mb-1">
                    Refund to
                  </span>
                  <span className="text-[13.125px] text-gray-800 font-bold leading-tight">
                    {refund.method}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-[11.25px] flex flex-col text-left">
                  <span className="text-[11.25px] text-gray-500 font-semibold mb-1">
                    Expected by
                  </span>
                  <span className="text-[13.125px] text-gray-800 font-bold">
                    {refund.expectedBy}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Actions Sidebar (Booking Actions, Stars, Help, Book another trip) */}
          <aside className="flex flex-col gap-[15px] w-full">

            {/* 1. Booking Actions Card */}
            <div className="bg-white rounded-[20px] border border-gray-200/80 p-[18.75px] flex flex-col gap-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
              <h4 className="text-[15px] font-bold text-gray-900 border-b border-gray-100 pb-2">
                Booking Actions
              </h4>
              <div className="flex flex-col gap-[10px] mt-1">
                {/* Download Boarding Pass */}
                <button
                  onClick={() => showStatus("Preparing PDF download... Your Boarding Pass is downloading.")}
                  className="w-full bg-[#FE2C1C] hover:bg-[#D82212] active:scale-98 text-white py-[11.25px] rounded-[10px] font-bold text-[13.125px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Download className="w-[14px] h-[14px]" />
                  <span>Download Boarding Pass</span>
                </button>

                {/* Email Ticket */}
                <button
                  onClick={() => showStatus(`Ticket & invoice PDF dispatched to: ${userEmail}`)}
                  className="w-full border border-gray-200 text-gray-800 hover:bg-gray-50 active:scale-98 py-[9.375px] rounded-[10px] font-bold text-[13.125px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-[13px] h-[13px]" />
                  <span>Email Ticket</span>
                </button>

                {/* Web Check-in */}
                <button
                  onClick={() => showStatus("Opening airline check-in gateway... Redirecting.")}
                  className="w-full border border-gray-200 text-gray-800 hover:bg-gray-50 active:scale-98 py-[9.375px] rounded-[10px] font-bold text-[13.125px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Globe className="w-[13px] h-[13px]" />
                  <span>Web Check-in</span>
                </button>

                {/* Manage Booking */}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full border border-gray-200 text-gray-800 hover:bg-gray-50 active:scale-98 py-[9.375px] rounded-[10px] font-bold text-[13.125px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Settings className="w-[13px] h-[13px]" />
                  <span>Manage Booking</span>
                </button>
              </div>
            </div>

            {/* 2. Star Rating Card */}
            <div className="bg-white rounded-[20px] border border-gray-200/80 p-[15px] flex flex-col items-center gap-[8px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <span className="text-[11.25px] font-bold text-gray-800">
                Enjoyed FlyAnyTrip?
              </span>
              
              {/* Interactive Stars */}
              <div className="flex items-center gap-[3.75px] py-1">
                {[1, 2, 3, 4, 5].map((starIdx) => {
                  const isActive = hoverRating !== null ? starIdx <= hoverRating : starIdx <= rating;
                  return (
                    <button
                      key={starIdx}
                      type="button"
                      onMouseEnter={() => setHoverRating(starIdx)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => {
                        setRating(starIdx);
                        showStatus(`Thank you for rating us ${starIdx} stars!`);
                      }}
                      className="transition-transform active:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-[18px] h-[18px] ${
                          isActive
                            ? "fill-[#FDC700] text-[#FDC700]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-[11.25px] font-bold text-[#E0E0E0] hover:text-[#FE2C1C] transition-colors cursor-pointer select-none">
                Rate your experience
              </span>
            </div>

            {/* 3. Need Help Card */}
            <div className="bg-white rounded-[20px] border border-gray-200/80 p-[15px] flex flex-col gap-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
              <span className="text-[11.25px] font-bold text-gray-800 uppercase tracking-wider">
                Need help?
              </span>
              <span className="text-[11.25px] font-medium text-gray-500 -mt-1">
                Our support team is available 24/7
              </span>
              <button
                onClick={() => showStatus("Dialing helpline... Support is connecting at 1800-000-4567")}
                className="w-full border border-gray-200 text-gray-800 hover:bg-gray-50 active:scale-98 py-[7.5px] rounded-[10px] font-bold text-[13.125px] flex items-center justify-center gap-2 transition-all cursor-pointer mt-1"
              >
                <Phone className="w-[13px] h-[13px]" />
                <span>Contact Support</span>
              </button>
            </div>

            {/* 4. Book Another Trip Card */}
            <Link to="/" className="w-full">
              <button className="w-full bg-white hover:bg-gray-50 active:scale-98 border border-gray-200 text-gray-800 py-[11.25px] rounded-[10px] font-bold text-[13.125px] flex items-center justify-center gap-[7.5px] transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <Plane className="w-[14px] h-[14px] text-gray-800 transform rotate-45 flex-shrink-0" />
                <span>Book Another Trip</span>
                <ArrowRight className="w-[12px] h-[12px] text-gray-800 flex-shrink-0" />
              </button>
            </Link>

          </aside>

        </div>
      </main>

      {/* Bottom Footer Section */}
      <Footer />
    </div>
  );
}
