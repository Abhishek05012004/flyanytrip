/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/FareModal.jsx
 * DESCRIPTION: Premium fare selection popup overlay card.
 * ============================================================================
 */

import React, { useState } from "react";
import { X, Calendar, User, Plane, Clock, ShieldCheck, Tag, Backpack, Briefcase, ChevronRight, Building } from "lucide-react";

export default function FareModal({ flight, onClose, onContinue }) {
  // Parse base price number
  const basePriceNum = parseInt(flight.price.replace(/[^\d]/g, ""), 10) || 2599;

  // Selected fare class state: 'saver', 'value', 'flexi'
  const [selectedFare, setSelectedFare] = useState("saver");

  // Dynamic calculations matching Figma card values
  const fareDetails = {
    saver: {
      title: "Economy Saver",
      badge: "Cheapest",
      badgeType: "red",
      price: basePriceNum,
      cabin: "1 × 7 kg",
      checkIn: "Check-in: Not included",
      cancel: "₹3,500 fee",
      change: "₹3,000 fee",
      perks: []
    },
    value: {
      title: "Economy Value",
      badge: "Popular",
      badgeType: "gray",
      price: basePriceNum + 800,
      cabin: "1 × 7 kg",
      checkIn: "Check-in: 1 × 15 kg",
      cancel: "₹2,000 fee",
      change: "₹1,500 fee",
      perks: ["Seat selection included"]
    },
    flexi: {
      title: "Economy Flexi",
      badge: "Best Value",
      badgeType: "gray",
      price: basePriceNum + 2200,
      cabin: "1 × 7 kg",
      checkIn: "Check-in: 2 × 15 kg",
      cancel: "Free cancellation",
      change: "Free date change",
      perks: ["Seat selection included", "Priority boarding", "Free meal"]
    }
  };

  const currentFare = fareDetails[selectedFare];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs font-inter p-4">
      {/* Modal Container card */}
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-fade-in text-left border border-[#EAEAEA] flex flex-col max-h-[90vh]">
        {/* ========================================================================= */}
        {/* 1. HEADER SECTION                                                        */}
        {/* ========================================================================= */}
        <div className="p-5 border-b border-[#EAEAEA] relative bg-white">
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[#EAEAEA] bg-white hover:bg-gray-50 flex items-center justify-center text-[#272727] hover:text-black transition-colors absolute right-5 top-5 z-10 shadow-3xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Primary Route Detail */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pr-10">
            {/* Airline Info */}
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-lg border border-gray-100 bg-white flex-shrink-0 overflow-hidden">
                <img src={flight.logo} alt={flight.airline} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-black text-[15px] text-[#272727] leading-tight">{flight.airline} &bull; {flight.code}</h3>
                <p className="text-[11px] text-[#7E7E7E] font-bold mt-1">Airbus A320 &bull; Economy</p>
                <div className="flex items-center space-x-1 mt-0.5 text-amber-500 text-[10px] font-black">
                  <span>★</span>
                  <span className="text-[#7E7E7E] font-bold">4.2 &middot; 1,248 ratings</span>
                </div>
              </div>
            </div>

            {/* Departure */}
            <div className="text-left md:text-center flex flex-col">
              <span className="text-[22px] font-black text-[#272727] leading-none">06:00</span>
              <span className="text-[13px] font-extrabold text-[#272727] uppercase mt-1">DEL</span>
              <span className="text-[11px] font-bold text-[#7E7E7E] mt-0.5">Terminal 2</span>
            </div>

            {/* Timeline */}
            <div className="text-center w-28 hidden md:block">
              <span className="text-[11px] font-bold text-[#7E7E7E]">2h 10m</span>
              <div className="relative w-full flex items-center justify-between my-1">
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="h-[1px] flex-grow bg-gray-200"></div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plane className="w-3 h-3 text-[#7E7E7E] rotate-45 bg-white px-0.5 box-content" />
                </div>
              </div>
              <span className="text-[11px] text-[#7E7E7E] font-bold">Non-stop</span>
            </div>

            {/* Arrival */}
            <div className="text-left md:text-center flex flex-col">
              <span className="text-[22px] font-black text-[#272727] leading-none">08:10</span>
              <span className="text-[13px] font-extrabold text-[#272727] uppercase mt-1">BOM</span>
              <span className="text-[11px] font-bold text-[#7E7E7E] mt-0.5">Terminal 1</span>
            </div>
          </div>

          {/* Quick info icons row */}
          <div className="flex flex-wrap items-center gap-5 mt-4 text-[12px] font-bold text-[#6B6B6B] border-t border-[#EAEAEA] pt-3 select-none">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7E7E7E]" />
              <span>15 Dec 2026</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#7E7E7E]" />
              <span>Economy Saver</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Plane className="w-3.5 h-3.5 text-[#7E7E7E] rotate-45" />
              <span>6E-204</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7E7E7E]" />
              <span>On-time: 89%</span>
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. FARE SELECTION GRID                                                   */}
        {/* ========================================================================= */}
        <div className="p-5 flex-grow overflow-y-auto bg-gray-50/20">
          <span className="text-[11px] uppercase font-black tracking-widest text-[#7E7E7E] block mb-3.5">
            SELECT A FARE CLASS
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(fareDetails).map((key) => {
              const item = fareDetails[key];
              const isSelected = selectedFare === key;
              const isRedBadge = item.badgeType === "red";

              return (
                <div
                  key={key}
                  onClick={() => setSelectedFare(key)}
                  className={`border rounded-xl p-4.5 cursor-pointer transition-all flex flex-col justify-between relative min-h-[300px] select-none hover:shadow-2xs ${
                    isSelected 
                      ? "bg-[#FFF9F8] border-[#FF2D1A] ring-1 ring-[#FF2D1A] shadow-3xs" 
                      : "bg-white border-[#EAEAEA] hover:border-gray-300"
                  }`}
                >
                  
                  {/* Card Header details */}
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      {/* Concentric Circle Radio Selector */}
                      {isSelected ? (
                        <span className="w-[18px] h-[18px] rounded-full border-2 border-[#FF2D1A] flex items-center justify-center bg-white flex-shrink-0">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D1A]"></span>
                        </span>
                      ) : (
                        <span className="w-[18px] h-[18px] rounded-full border border-gray-300 flex-shrink-0 bg-white"></span>
                      )}

                      {/* Badge */}
                      <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded ${
                        isRedBadge ? "bg-[#FF2D1A] text-white" : "bg-[#F5F5F5] border border-[#EAEAEA] text-[#272727]"
                      }`}>
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[14.5px] text-[#272727] mb-3.5">{item.title}</h4>

                    {/* Features checklist */}
                    <div className="space-y-2 text-[11px] font-bold">
                      <div className="flex items-center space-x-1.5 text-[#272727] font-extrabold mb-2.5">
                        <Backpack className="w-3.5 h-3.5 text-[#7E7E7E]" />
                        <span>Baggage</span>
                      </div>
                      <p className="pl-5 text-[#6B6B6B] font-semibold text-[12.5px]">Cabin: {item.cabin}</p>
                      <p className="pl-5 text-[#6B6B6B] font-semibold text-[12.5px]">{item.checkIn}</p>
                      
                      <div className="flex items-center space-x-1.5 text-[#272727] font-extrabold mb-2.5 pt-2">
                        <Briefcase className="w-3.5 h-3.5 text-[#7E7E7E]" />
                        <span>Flexibility</span>
                      </div>
                      <p className="pl-5 text-[#6B6B6B] font-semibold text-[12.5px]">Cancel: {item.cancel}</p>
                      <p className="pl-5 text-[#6B6B6B] font-semibold text-[12.5px]">Change: {item.change}</p>

                      {/* Extra Perks with green checkmarks */}
                      {item.perks.map((perk, pIdx) => (
                        <div key={pIdx} className="flex items-center space-x-1.5 text-[#00A852] pt-1.5">
                          <svg className="w-3.5 h-3.5 text-[#00A852] stroke-[3.5] fill-none" viewBox="0 0 24 24" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="font-bold text-[12.5px]">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card pricing bottom row */}
                  <div className="border-t border-[#EAEAEA] pt-3.5 mt-4 text-left">
                    <span className="text-[10px] text-[#7E7E7E] font-bold block">per adult</span>
                    <span className="text-[22px] font-black text-[#272727]">₹{item.price.toLocaleString()}</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. HOTEL PROMO STRIP                                                     */}
        {/* ========================================================================= */}
        <div className="px-5 py-2.5 bg-[#FFF3F2] border-t border-b border-[#FFE4E2] flex items-center justify-between text-[11px] font-bold text-[#FF2D1A] select-none">
          <div className="flex items-center space-x-1.5">
            <Building className="w-4 h-4 text-[#FF2D1A] flex-shrink-0" />
            <span>Book a hotel &amp; save up to 22% on bundled bookings &ndash; exclusive for flight passengers!</span>
          </div>
          <button className="hover:underline flex items-center space-x-0.5 cursor-pointer text-[#FF2D1A] font-extrabold bg-transparent border-0 outline-none">
            <span>View</span>
            <ChevronRight className="w-3 h-3 inline" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. MODAL ACTION FOOTER                                                    */}
        {/* ========================================================================= */}
        <div className="p-5 bg-white flex items-center justify-between border-t border-[#EAEAEA]">
          <div className="text-left flex flex-col justify-center">
            <span className="text-[12px] text-[#7E7E7E] font-medium block">
              Selected: <strong className="text-[#272727] font-extrabold">{currentFare.title}</strong>
            </span>
            <span className="text-[24px] font-black text-[#272727] leading-none mt-1">₹{currentFare.price.toLocaleString()}</span>
          </div>

          <button 
            onClick={() => onContinue(currentFare)}
            className="w-[160px] h-[40px] rounded-lg bg-[#FF2D1A] hover:bg-red-750 text-white font-black text-[13px] tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center select-none"
          >
            <span>Continue &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
