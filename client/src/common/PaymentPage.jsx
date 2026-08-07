/**
 * ============================================================================
 * PATH: client/src/common/PaymentPage.jsx
 * DESCRIPTION: Global Payment Gateway Page matching the Figma design system.
 *              Includes interactive coupons, payment tabs, dynamic fare calculations,
 *              and a secure simulated payment gateway.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Check,
  User,
  MapPin,
  Star,
  CreditCard,
  Lock,
  ShieldCheck,
  Building2,
  Wallet,
  Smartphone,
  Loader2,
  Tag,
  ArrowRight,
  AlertCircle,
  ChevronDown
} from "lucide-react";

import Header from "./Header";
import Footer from "./Footer";
import BookingSummary from "../pages/flights/booking/components/BookingSummary";
import FareSummary from "../pages/flights/booking/components/FareSummary";

// Vector QR Code Component for pixel-perfect, clean rendering without remote assets
const QRCodeSVG = () => (
  <svg className="w-full h-full p-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Finder Pattern: Top Left */}
    <rect x="5" y="5" width="25" height="25" rx="2" fill="black" />
    <rect x="10" y="10" width="15" height="15" rx="1" fill="white" />
    <rect x="14" y="14" width="7" height="7" rx="0.5" fill="black" />

    {/* Finder Pattern: Top Right */}
    <rect x="70" y="5" width="25" height="25" rx="2" fill="black" />
    <rect x="75" y="10" width="15" height="15" rx="1" fill="white" />
    <rect x="79" y="14" width="7" height="7" rx="0.5" fill="black" />

    {/* Finder Pattern: Bottom Left */}
    <rect x="5" y="70" width="25" height="25" rx="2" fill="black" />
    <rect x="10" y="75" width="15" height="15" rx="1" fill="white" />
    <rect x="14" y="79" width="7" height="7" rx="0.5" fill="black" />

    {/* Small Alignment Pattern: Bottom Right */}
    <rect x="75" y="75" width="9" height="9" rx="1" fill="black" />
    <rect x="77" y="77" width="5" height="5" rx="0.5" fill="white" />
    <rect x="79" y="79" width="1" height="1" fill="black" />

    {/* Random QR Code Data blocks */}
    <rect x="35" y="5" width="5" height="5" fill="black" />
    <rect x="45" y="5" width="10" height="5" fill="black" />
    <rect x="60" y="5" width="5" height="10" fill="black" />
    <rect x="35" y="15" width="15" height="5" fill="black" />
    <rect x="55" y="15" width="5" height="5" fill="black" />

    <rect x="5" y="35" width="5" height="15" fill="black" />
    <rect x="15" y="45" width="10" height="5" fill="black" />
    <rect x="20" y="35" width="5" height="5" fill="black" />

    <rect x="35" y="30" width="10" height="10" fill="black" />
    <rect x="50" y="35" width="5" height="5" fill="black" />
    <rect x="60" y="30" width="15" height="5" fill="black" />
    <rect x="80" y="35" width="15" height="10" fill="black" />
    <rect x="70" y="40" width="5" height="15" fill="black" />

    <rect x="35" y="45" width="5" height="10" fill="black" />
    <rect x="45" y="50" width="15" height="5" fill="black" />

    <rect x="5" y="55" width="15" height="5" fill="black" />
    <rect x="25" y="55" width="5" height="10" fill="black" />

    <rect x="35" y="60" width="10" height="5" fill="black" />
    <rect x="50" y="60" width="5" height="15" fill="black" />
    <rect x="60" y="60" width="5" height="5" fill="black" />
    <rect x="70" y="60" width="10" height="10" fill="black" />

    <rect x="35" y="75" width="5" height="15" fill="black" />
    <rect x="45" y="70" width="15" height="5" fill="black" />
    <rect x="45" y="80" width="5" height="10" fill="black" />
    <rect x="55" y="85" width="15" height="5" fill="black" />
    <rect x="65" y="75" width="5" height="5" fill="black" />
  </svg>
);

export default function PaymentPage() {
  const routerNavigate = useNavigate();
  const location = useLocation();

  // Fallback flight configuration matching Figma exactly
  const defaultFlight = {
    airline: "IndiGo",
    code: "6E-204",
    logo: "https://images.kiwi.com/airlines/64/6E.png",
    depTime: "06:00",
    arrTime: "08:10",
    duration: "2h 10m",
    stops: "Non-stop",
    route: "DEL → BOM",
    date: "15 Dec 2026",
    class: "Economy",
    basePrice: 3499,
    taxes: 420
  };

  // Retrieve parameters passed from a booking page or use defaults
  const bookingType = location.state?.bookingType || "flight";
  const rawFlight = location.state?.flight || defaultFlight;
  const basePrice = location.state?.basePrice || rawFlight.basePrice || 3499;
  const taxes = location.state?.taxes || rawFlight.taxes || 420;

  const flight = {
    ...defaultFlight,
    ...rawFlight,
    route: rawFlight.route || "DEL → BOM",
    class: location.state?.fare?.title || rawFlight.class || "Economy"
  };

  // Form interactive states
  const [activeTab, setActiveTab] = useState("upi"); // upi, card, netbanking, wallets
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Payment states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  // Sandbox simulation tools
  const [paymentOutcome, setPaymentOutcome] = useState("success"); // success, failure

  // Dynamic Fare Calculations
  const getDiscount = () => {
    if (appliedCoupon === "FIRSTFLY") return 500;
    if (appliedCoupon === "FLY200") return 200;
    if (appliedCoupon === "HDFC15") return Math.round(basePrice * 0.15);
    return 0;
  };

  const discount = getDiscount();
  const totalAmount = basePrice + taxes - discount;

  // Coupon handling
  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (code === "FIRSTFLY" || code === "FLY200" || code === "HDFC15") {
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon "${code}" applied successfully!`);
      setCouponError("");
    } else if (code === "") {
      setCouponError("Please enter a coupon code.");
      setCouponSuccess("");
    } else {
      setCouponError("Invalid coupon code. Try FIRSTFLY, FLY200, or HDFC15.");
      setCouponSuccess("");
    }
  };

  const handleSelectCouponPill = (code) => {
    setCouponInput(code);
    setAppliedCoupon(code);
    setCouponSuccess(`Coupon "${code}" applied successfully!`);
    setCouponError("");
  };

  const handlePay = () => {
    // Validate inputs depending on tab
    if (activeTab === "upi" && !upiId.includes("@")) {
      alert("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }
    if (activeTab === "card" && (cardNumber.length < 12 || cardExpiry.length < 4 || cardCvv.length < 3)) {
      alert("Please fill in valid Credit/Debit card details");
      return;
    }

    if (paymentOutcome === "success") {
      if (bookingType === "hotel") {
        routerNavigate("/hotels/booking-success", { state: location.state });
      } else if (bookingType === "package") {
        routerNavigate("/packages/booking-success", { state: location.state });
      } else {
        routerNavigate("/flights/booking-success", { state: location.state });
      }
    } else {
      routerNavigate("/booking-failure", { state: location.state });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between font-sans">

      {/* 1. Global Header Wrapper */}
      <Header />

      {/* 2. Main Page Content */}
      <main className="max-w-[1393px] mx-auto px-4 py-7 w-full flex-grow flex flex-col gap-6 font-quicksand">



        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_395px] gap-7 items-start">

          {/* Left Column: Coupon, Tabs & CTA */}
          <div className="w-full flex flex-col gap-6 text-left">

            {/* Coupon Card */}
            <div className="bg-white border border-[#EAEAEA] p-5 rounded-2xl shadow-xs">
              <form onSubmit={handleApplyCoupon} className="flex items-center rounded-xl border border-gray-200 focus-within:border-[#FF2D1A] focus-within:ring-1 focus-within:ring-[#FF2D1A] bg-white px-3.5 py-1">
                <Tag className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 min-w-0 border-0 outline-none text-sm font-jetbrains text-gray-700 bg-transparent py-2 focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  className="ml-2 px-3 py-1.5 text-[#E53935] hover:text-red-700 font-bold text-sm transition-all font-satoshi"
                >
                  Apply
                </button>
              </form>

              {/* Coupon Response Messages */}
              {couponSuccess && (
                <p className="text-emerald-600 text-xs font-semibold mt-2.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-red-500 text-xs font-semibold mt-2.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                </p>
              )}

              {/* Coupon Code Pill Options */}
              <div className="flex gap-2.5 mt-3.5">
                {["HDFC15", "FLY200", "FIRSTFLY"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelectCouponPill(code)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold font-jetbrains transition-all ${appliedCoupon === code
                        ? "bg-[#FCECEC] border-[#FF2D1A] text-[#FF2D1A] shadow-2xs"
                        : "border-gray-200 text-[#6B6B6B] hover:bg-gray-50 bg-white"
                      }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs">

              {/* Tab Header Row */}
              <div className="flex border-b border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setActiveTab("upi")}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-xs transition-all border-b-2 ${activeTab === "upi"
                      ? "bg-[#FCECEC]/60 border-[#FF2D1A] text-[#FF2D1A]"
                      : "border-transparent text-[#6B6B6B] hover:bg-gray-50 bg-white"
                    }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("card")}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-xs transition-all border-b-2 ${activeTab === "card"
                      ? "bg-[#FCECEC]/60 border-[#FF2D1A] text-[#FF2D1A]"
                      : "border-transparent text-[#6B6B6B] hover:bg-gray-50 bg-white"
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit / Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("netbanking")}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-xs transition-all border-b-2 ${activeTab === "netbanking"
                      ? "bg-[#FCECEC]/60 border-[#FF2D1A] text-[#FF2D1A]"
                      : "border-transparent text-[#6B6B6B] hover:bg-gray-50 bg-white"
                    }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("wallets")}
                  className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-xs transition-all border-b-2 ${activeTab === "wallets"
                      ? "bg-[#FCECEC]/60 border-[#FF2D1A] text-[#FF2D1A]"
                      : "border-transparent text-[#6B6B6B] hover:bg-gray-50 bg-white"
                    }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Wallets</span>
                </button>
              </div>

              {/* Tab Content Panel */}
              <div className="p-6">

                {/* UPI Panel */}
                {activeTab === "upi" && (
                  <div className="space-y-6">
                    {/* UPI ID field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6B6B6B]">UPI ID *</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@paytm / @ybl / @px"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF2D1A] focus:ring-1 focus:ring-[#FF2D1A] text-gray-700 bg-[#F5F5F5] font-semibold"
                        />
                      </div>
                    </div>

                    {/* Popular UPI apps */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Popular UPI Apps</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* GPay */}
                        <button
                          type="button"
                          onClick={() => setUpiId("username@okaxis")}
                          className="flex items-center justify-center gap-2.5 h-[80px] rounded-2xl bg-[#EFF6FF] border border-[#EFF6FF] hover:border-blue-300 transition-all group w-full px-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                            <img src="/assets/payment/image/gpay.png" alt="GPay" className="w-7 h-7 object-contain" />
                          </div>
                          <span className="text-[11.25px] font-bold text-[#1A1A1A]">GPay</span>
                        </button>

                        {/* PhonePe */}
                        <button
                          type="button"
                          onClick={() => setUpiId("username@ybl")}
                          className="flex items-center justify-center gap-2.5 h-[80px] rounded-2xl bg-[#FAF5FF] border border-[#FAF5FF] hover:border-purple-300 transition-all group w-full px-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                            <img src="/assets/payment/image/phonepe.png" alt="PhonePe" className="w-7 h-7 object-contain" />
                          </div>
                          <span className="text-[11.25px] font-bold text-[#1A1A1A]">PhonePe</span>
                        </button>

                        {/* Paytm */}
                        <button
                          type="button"
                          onClick={() => setUpiId("username@paytm")}
                          className="flex items-center justify-center gap-2.5 h-[80px] rounded-2xl bg-[#F0F9FF] border border-[#F0F9FF] hover:border-sky-300 transition-all group w-full px-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                            <img src="/assets/payment/image/paytm.png" alt="Paytm" className="w-[48px] h-auto object-contain" />
                          </div>
                          <span className="text-[11.25px] font-bold text-[#1A1A1A]">Paytm</span>
                        </button>

                        {/* BHIM */}
                        <button
                          type="button"
                          onClick={() => setUpiId("username@upi")}
                          className="flex items-center justify-center gap-2.5 h-[80px] rounded-2xl bg-[#FFF7ED] border border-[#FFF7ED] hover:border-orange-300 transition-all group w-full px-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                            <img src="/assets/payment/image/bhim.png" alt="BHIM" className="w-7 h-7 object-contain" />
                          </div>
                          <span className="text-[11.25px] font-bold text-[#1A1A1A]">BHIM</span>
                        </button>
                      </div>
                    </div>

                    {/* QR Code section */}
                    <div className="flex flex-col items-center justify-center gap-3 pt-6 border-t border-[#F5F5F5] text-center">
                      <span className="text-[11.25px] font-bold text-[#6B6B6B]">Or scan QR code</span>
                      <div className="w-[120px] h-[120px] bg-white border border-[#EAEAEA] p-1.5 rounded-2xl flex-shrink-0 shadow-xs flex items-center justify-center">
                        <img src="/assets/payment/image/scanner.png" alt="Scanner QR" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Credit/Debit Card Panel */}
                {activeTab === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#6B6B6B]">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF2D1A] bg-white font-semibold text-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#6B6B6B]">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF2D1A] bg-white font-semibold text-gray-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#6B6B6B]">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="•••"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF2D1A] bg-white font-semibold text-gray-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#6B6B6B]">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF2D1A] bg-white font-semibold text-gray-700"
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking Panel */}
                {activeTab === "netbanking" && (
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Popular Banks</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {["SBI", "HDFC", "ICICI", "AXIS", "KOTAK", "PNB"].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${selectedBank === bank
                              ? "bg-[#FCECEC] border-[#FF2D1A] text-[#FF2D1A]"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                            }`}
                        >
                          <span>{bank} Bank</span>
                          {selectedBank === bank && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      ))}
                    </div>

                    <div className="relative mt-4">
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF2D1A] bg-white font-semibold text-gray-700 appearance-none cursor-pointer"
                      >
                        <option value="">Or Select from other banks</option>
                        <option value="BOB">Bank of Baroda</option>
                        <option value="BOI">Bank of India</option>
                        <option value="CANARA">Canara Bank</option>
                        <option value="UNION">Union Bank of India</option>
                        <option value="YES">Yes Bank</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Wallets Panel */}
                {activeTab === "wallets" && (
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Select Digital Wallet</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "amazon", name: "Amazon Pay Wallet" },
                        { id: "paytm_w", name: "Paytm Wallet Balance" },
                        { id: "phonepe_w", name: "PhonePe Wallet" },
                        { id: "mobikwik", name: "Mobikwik Wallet" }
                      ].map((wallet) => (
                        <button
                          key={wallet.id}
                          type="button"
                          onClick={() => setSelectedWallet(wallet.id)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-xs font-bold transition-all ${selectedWallet === wallet.id
                              ? "bg-[#FCECEC] border-[#FF2D1A] text-[#FF2D1A]"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                            }`}
                        >
                          <span>{wallet.name}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedWallet === wallet.id ? "border-[#FF2D1A]" : "border-gray-300"
                            }`}>
                            {selectedWallet === wallet.id && <div className="w-2.5 h-2.5 bg-[#FF2D1A] rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Pay CTA Button block */}
            <div className="space-y-3.5">
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-4 bg-[#FF2D1A] hover:bg-red-750 text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 select-none active:scale-[0.99] font-quicksand cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{totalAmount.toLocaleString()} Securely</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <p className="text-[11px] text-[#6B6B6B] font-semibold text-center leading-relaxed max-w-xl mx-auto">
                By proceeding, you agree to our <a href="/terms" className="underline hover:text-[#FF2D1A]">Terms & Conditions</a> and <a href="/privacy" className="underline hover:text-[#FF2D1A]">Privacy Policy</a>.
              </p>
            </div>

          </div>

          {/* Right Column: Booking Summary & Fare Summary sidebar */}
          <aside className="w-full flex flex-col gap-6 text-left">
            <BookingSummary flight={flight} />
            <FareSummary
              basePrice={basePrice}
              taxes={taxes}
              additionalAmount={location.state?.addonsData?.totalAdditional || 0}
              totalAmount={totalAmount}
              discount={discount}
              promoCode={appliedCoupon}
            />

            {/* SSL PCI-DSS Trust Signal Panel */}
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4.5 flex items-start gap-3 text-xs font-semibold text-[#15803D] select-none font-sans leading-relaxed shadow-3xs">
              <ShieldCheck className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
              <span>PCI DSS Level 1 Certified · 256-bit SSL secure bank payments · Zero extra processing charges applied.</span>
            </div>

          </aside>

        </div>

        {/* 3. Developer Sandbox Control Panel (Expander) */}
        <div className="mt-8 border border-dashed border-gray-300 rounded-2xl p-5 bg-white max-w-2xl mx-auto w-full select-none shadow-xs text-left">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
              <h4 className="font-bold text-sm text-gray-800">Developer Sandbox Control Panel</h4>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-gray-100 px-2 py-0.5 rounded text-gray-500">Testing Mode</span>
          </div>

          <p className="text-xs text-gray-500 font-semibold mb-4 leading-normal">
            Use this panel to customize the payment outcome simulated in this testing workspace. You can choose whether a payment triggers success or failure before clicking &ldquo;Pay Securely&rdquo;.
          </p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setPaymentOutcome("success")}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${paymentOutcome === "success"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-3xs"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 bg-white"
                }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentOutcome === "success" ? "border-emerald-600" : "border-gray-300"
                }`}>
                {paymentOutcome === "success" && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
              </div>
              <span>Simulate Payment Success</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentOutcome("failure")}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${paymentOutcome === "failure"
                  ? "bg-rose-50 border-rose-500 text-rose-700 shadow-3xs"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 bg-white"
                }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentOutcome === "failure" ? "border-rose-600" : "border-gray-300"
                }`}>
                {paymentOutcome === "failure" && <div className="w-2 h-2 bg-rose-600 rounded-full" />}
              </div>
              <span>Simulate Payment Failure</span>
            </button>
          </div>
        </div>

      </main>



      {/* 5. Global Footer Wrapper */}
      <Footer />

    </div>
  );
}
