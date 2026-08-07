/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/BookingSeat.jsx
 * DESCRIPTION: Interactive flight seat map selector console (Step 2).
 * ============================================================================
 */

import React, { useState } from "react";
import { Plane } from "lucide-react";

export default function BookingSeat({ onContinue, onSeatSelect }) {
  // Seat state map row configurations (8 rows in Figma)
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const columnsLeft = ["A", "B", "C"];
  const columnsRight = ["D", "E", "F"];

  // State for user's selected seat (default Row 4, Seat C)
  const [selectedSeat, setSelectedSeat] = useState("4C");

  // Initial seat mock status configurations exactly matching Figma
  const seatConfig = {
    // Taken seats (grey)
    "1A": "taken", "1B": "taken",
    "2C": "taken",
    "3D": "taken",
    "4E": "taken",
    "5A": "taken",
    "6F": "taken",
    "7B": "taken", "7C": "taken", "7D": "taken",
    "8D": "taken",

    // Exit rows (yellow)
    "4A": "exit", "4B": "exit", "4C": "exit", "4D": "exit", "4F": "exit",

    // Window seats (blue)
    "1F": "window",
    "2A": "window", "2F": "window",
    "3A": "window", "3F": "window",
    "5F": "window",
    "6A": "window",
    "7A": "window", "7F": "window",
    "8A": "window", "8F": "window"
  };

  const handleSeatClick = (seatId) => {
    if (seatConfig[seatId] === "taken") return;

    const newSeat = selectedSeat === seatId ? "" : seatId;
    setSelectedSeat(newSeat);
    onSeatSelect(newSeat);
  };

  const getSeatStyles = (seatId) => {
    if (selectedSeat === seatId) {
      return "bg-[#1A1A1A] border-[#1A1A1A] text-white font-medium";
    }

    const type = seatConfig[seatId];
    switch (type) {
      case "taken":
        return "bg-[#6B6B6B] border-[#6B6B6B] text-[#6B6B6B] cursor-not-allowed";
      case "window":
        return "bg-[#DBEAFE] border-[#DBEAFE] text-[#1C3FAA] hover:bg-[#BFDBFE] font-medium";
      case "exit":
        return "bg-[#FEF3C7] border-[#FEF3C7] text-[#D97706] hover:bg-[#FDE68A] font-medium";
      default:
        // Available (white)
        return "bg-white border-[#EAEAEA] text-[#333333] hover:bg-gray-50 font-medium";
    }
  };

  return (
    <div className="space-y-6 font-inter text-left">

      {/* Seat Selection Panel */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-[32px] shadow-2xs font-inter">

        {/* Header */}
        <h3 className="text-[18.57px] font-bold text-[#1A1A1A] mb-1 font-inter">Choose Your Seat</h3>

        {/* Legend row */}
        <div className="flex flex-wrap gap-6 text-[12px] font-medium text-[#6B6B6B] border-b border-[#EAEAEA] pb-4 mb-6 select-none font-inter">
          <div className="flex items-center space-x-2">
            <span className="w-[16px] h-[16px] rounded bg-[#6B6B6B] border border-[#6B6B6B]"></span>
            <span>Taken</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-[16px] h-[16px] rounded bg-[#1A1A1A] border border-[#1A1A1A]"></span>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-[16px] h-[16px] rounded bg-white border border-[#EAEAEA]"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-[16px] h-[16px] rounded bg-[#DBEAFE] border border-[#DBEAFE]"></span>
            <span>Window</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-[16px] h-[16px] rounded bg-[#FEF3C7] border border-[#FEF3C7]"></span>
            <span>Exit Row</span>
          </div>
        </div>

        {/* Visual aircraft cabin seat layout */}
        <div className="border border-[#EAEAEA] rounded-2xl p-6 bg-gray-50/20 flex flex-col items-center select-none overflow-x-auto">

          {/* Cabin Cockpit flight nose cone dome matching Figma specs (90x30, #F0F0F0 background) */}
          <div className="w-[90px] h-[30px] border border-[#D0D0D0] bg-[#F0F0F0] rounded-t-full flex items-center justify-center mb-8 select-none">
            <Plane className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="space-y-3 min-w-[280px]">
            {/* Seat Column headers */}
            <div className="grid grid-cols-7 gap-3 text-center text-[11.25px] font-medium text-[#6B6B6B] mb-2 font-inter">
              <span>A</span>
              <span>B</span>
              <span>C</span>
              <span className="w-6"></span> {/* Aisle gap */}
              <span>D</span>
              <span>E</span>
              <span>F</span>
            </div>

            {/* Seat Rows mapping */}
            {rows.map((row) => (
              <div key={row} className="grid grid-cols-7 gap-3 items-center text-center">
                {/* Left Row Seats */}
                {columnsLeft.map((col) => {
                  const seatId = `${row}${col}`;
                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => handleSeatClick(seatId)}
                      className={`w-[30px] h-[26px] rounded-[4px] text-[11.25px] border transition-all flex items-center justify-center select-none cursor-pointer ${getSeatStyles(seatId)}`}
                    >
                      {col}
                    </button>
                  );
                })}

                {/* Row Number (Center Aisle) */}
                <span className="text-[11.25px] font-medium text-[#6B6B6B] w-6 select-none font-inter">{row}</span>

                {/* Right Row Seats */}
                {columnsRight.map((col) => {
                  const seatId = `${row}${col}`;
                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => handleSeatClick(seatId)}
                      className={`w-[30px] h-[26px] rounded-[4px] text-[11.25px] border transition-all flex items-center justify-center select-none cursor-pointer ${getSeatStyles(seatId)}`}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Wing Divider */}
          <div className="flex items-center justify-center space-x-2.5 mt-7 w-full max-w-[360px] select-none font-inter">
            <div className="h-[1px] bg-[#D0D0D0] flex-grow"></div>
            <span className="text-[11.25px] font-medium text-[#6B6B6B] whitespace-nowrap">✈ Wing</span>
            <div className="h-[1px] bg-[#D0D0D0] flex-grow"></div>
          </div>

          <p className="text-[11.25px] text-[#6B6B6B] font-medium mt-6 text-center font-inter max-w-[428px]">
            Seat selection is optional. You can skip and get a system-assigned seat for free.
          </p>

        </div>

      </div>

      {/* Continue button */}
      <button
        type="button"
        onClick={onContinue}
        className="w-full h-[60px] bg-[#FF2D1A] hover:bg-red-700 text-white font-semibold text-[18.57px] rounded-xl transition-all flex items-center justify-center space-x-3 shadow-sm select-none cursor-pointer active:scale-[0.99] font-inter"
      >
        <span>Continue</span>
        <svg className="w-[18.57px] h-[18.57px] text-white stroke-[3] fill-none" viewBox="0 0 24 24" stroke="currentColor">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
}
