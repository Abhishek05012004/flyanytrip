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

  const segments = flight.rawOption?.Segments?.[0] || [];
  const firstLeg = segments[0] || {};
  const lastLeg = segments[segments.length - 1] || firstLeg;

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = days[date.getDay()];
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day} ${month} ${year}`;
  };

  const cabinVal = firstLeg.CabinBaggage || "7 KG";
  const baggageVal = firstLeg.Baggage || "15 KG";

  // Parse penalties from API response
  const rawCancel = flight.rawOption?.PenaltyCharges?.CancellationCharge;
  const rawReissue = flight.rawOption?.PenaltyCharges?.ReissueCharge;

  const getPenaltyFee = (chargeStr, fallback) => {
    if (!chargeStr) return fallback;
    const num = parseInt(chargeStr.replace(/[^\d]/g, ""), 10);
    if (isNaN(num)) return chargeStr;
    return `₹${num.toLocaleString('en-IN')} fee`;
  };

  const getReducedFee = (chargeStr, reduction, fallback) => {
    if (!chargeStr) return fallback;
    const num = parseInt(chargeStr.replace(/[^\d]/g, ""), 10);
    if (isNaN(num)) return chargeStr;
    const reduced = Math.max(0, num - reduction);
    return reduced === 0 ? "Free" : `₹${reduced.toLocaleString('en-IN')} fee`;
  };

  const parsedCancel = getPenaltyFee(rawCancel, "₹3,500 fee");
  const parsedReissue = getPenaltyFee(rawReissue, "₹3,000 fee");
  const valueCancel = getReducedFee(rawCancel, 1000, "₹2,500 fee");
  const valueReissue = getReducedFee(rawReissue, 1000, "₹2,000 fee");

  // Parse Inclusions
  const apiPerks = [];
  if (Array.isArray(flight.rawOption?.FareInclusions)) {
    flight.rawOption.FareInclusions.forEach(inc => {
      if (inc) {
        inc.split("&&").forEach(p => {
          const t = p.trim();
          if (t && t.toLowerCase() !== "included") {
            const cap = t.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
            apiPerks.push(cap);
          }
        });
      }
    });
  }

  // Dynamic calculations matching API values
  const fareDetails = {
    saver: {
      title: "Economy Saver",
      badge: "Cheapest",
      badgeType: "red",
      price: basePriceNum,
      cabin: cabinVal,
      checkIn: `Check-in: ${baggageVal}`,
      cancel: parsedCancel,
      change: parsedReissue,
      perks: apiPerks
    },
    value: {
      title: "Economy Value",
      badge: "Popular",
      badgeType: "gray",
      price: basePriceNum + 800,
      cabin: cabinVal,
      checkIn: `Check-in: ${baggageVal} (Included)`,
      cancel: valueCancel,
      change: valueReissue,
      perks: ["Seat selection included", ...apiPerks]
    },
    flexi: {
      title: "Economy Flexi",
      badge: "Best Value",
      badgeType: "gray",
      price: basePriceNum + 2200,
      cabin: cabinVal,
      checkIn: `Check-in: ${baggageVal} (Included)`,
      cancel: "Free cancellation",
      change: "Free date change",
      perks: ["Seat selection included", "Priority boarding", "Free meal", ...apiPerks]
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pr-20 md:pr-28">
            {/* Airline Info */}
            <div className="flex items-center space-x-3.5 w-64 flex-shrink-0">
              <div className="w-9 h-9 rounded-lg border border-gray-100 bg-white flex-shrink-0 overflow-hidden">
                <img src={flight.logo} alt={flight.airline} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-black text-[15px] text-[#272727] leading-tight">{flight.airline} &bull; {flight.code}</h3>
                <p className="text-[11px] text-[#7E7E7E] font-bold mt-1">{formatDate(firstLeg.Origin?.DepTime)}</p>
              </div>
            </div>

            {/* Departure */}
            <div className="text-left md:text-center flex flex-col">
              <span className="text-[22px] font-black text-[#272727] leading-none">{flight.depTime}</span>
              <span className="text-[13px] font-extrabold text-[#272727] uppercase mt-1">{flight.fromCode}</span>
              <span className="text-[11px] font-bold text-[#7E7E7E] mt-0.5">
                {firstLeg.Origin?.Airport?.Terminal ? `Terminal ${firstLeg.Origin.Airport.Terminal}` : ""}
              </span>
            </div>

            {/* Timeline */}
            <div className="text-center flex-grow max-w-[180px] hidden md:block mx-6">
              <span className="text-[11px] font-bold text-[#7E7E7E]">{flight.duration}</span>
              <div className="relative w-full flex items-center justify-between my-1">
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="h-[1px] flex-grow bg-gray-200"></div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plane className="w-3 h-3 text-[#7E7E7E] rotate-45 bg-white px-0.5 box-content" />
                </div>
              </div>
              <span className="text-[11px] text-[#7E7E7E] font-bold">{flight.stops}</span>
            </div>

            {/* Arrival */}
            <div className="text-left md:text-center flex flex-col">
              <div className="relative inline-flex items-center justify-start md:justify-center">
                <span className="text-[22px] font-black text-[#272727] leading-none">{flight.arrTime}</span>
                {flight.dayDiff > 0 && (
                  <span className="absolute left-full ml-1 text-[9px] font-bold text-[#FF2D1A] select-none flex flex-col items-start leading-[1.1] top-0 whitespace-nowrap">
                    <span>+{flight.dayDiff}</span>
                    <span className="text-[7px] uppercase tracking-wider text-gray-500">Day</span>
                  </span>
                )}
              </div>
              <span className="text-[13px] font-extrabold text-[#272727] uppercase mt-1">{flight.toCode}</span>
              <span className="text-[11px] font-bold text-[#7E7E7E] mt-0.5">
                {lastLeg.Destination?.Airport?.Terminal ? `Terminal ${lastLeg.Destination.Airport.Terminal}` : ""}
              </span>
            </div>
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
