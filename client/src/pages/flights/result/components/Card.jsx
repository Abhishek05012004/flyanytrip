/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/Card.jsx
 * DESCRIPTION: Premium flight result item card matching Figma layout exactly.
 * ============================================================================
 */

import React from "react";
import { Briefcase, Tag, Plane } from "lucide-react";

export default function Card({ flight, onSelect }) {
  // Determine badge colors dynamically (all badges use brand red in Figma)
  const badgeClasses = "bg-red-50 text-[#FF2D1A] border border-red-100";

  return (
    <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-2xs overflow-hidden hover:border-gray-300 hover:shadow-xs transition-all duration-200 font-inter text-left">
      
      {/* Primary Details Row (No Select button here!) */}
      <div className="p-5.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">
        
        {/* Airline Info Block */}
        <div className="flex items-center space-x-3.5 w-full md:w-44 select-none">
          <div className="w-10 h-10 rounded-lg border border-gray-100 shadow-3xs bg-white flex-shrink-0 overflow-hidden">
            <img 
              src={flight.logo} 
              alt={flight.airline} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h4 className="font-black text-[14px] text-[#272727] tracking-tight leading-tight">{flight.airline}</h4>
            <span className="text-[11px] text-[#7E7E7E] uppercase font-bold tracking-wider block mt-1">{flight.code}</span>
          </div>
        </div>

        {/* Departure Details */}
        <div className="text-center w-24 flex-shrink-0">
          <span className="text-[24px] font-black text-[#272727] leading-none">{flight.depTime}</span>
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#7E7E7E] block mt-1.5">{flight.fromCode}</span>
        </div>

        {/* Timeline Visual Progress Indicator */}
        <div className="flex-grow w-full md:max-w-xs text-center flex flex-col items-center select-none px-4">
          <span className="text-[11px] font-bold text-[#7E7E7E]">{flight.duration}</span>
          
          {/* Custom Timeline line with plane in center and circles on both ends */}
          <div className="relative w-full flex items-center justify-between my-1.5">
            <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="h-[1px] flex-grow bg-gray-200/80 mx-1"></div>
            <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></div>
            
            {/* Plane Icon inside a white box in the center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white px-2">
                <Plane className="w-3.5 h-3.5 text-[#7E7E7E] rotate-45" />
              </div>
            </div>
          </div>

          <span className="text-[11px] text-[#7E7E7E] font-bold">{flight.stops}</span>
        </div>

        {/* Arrival Details */}
        <div className="text-center w-24 flex-shrink-0">
          <span className="text-[24px] font-black text-[#272727] leading-none">{flight.arrTime}</span>
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#7E7E7E] block mt-1.5">{flight.toCode}</span>
        </div>

        {/* Price Block (Rightmost in top row) */}
        <div className="text-right w-full md:w-36 flex md:flex-col items-end justify-center pt-3 md:pt-0">
          <span className="text-[24px] font-black text-[#272727] leading-none">{flight.price}</span>
          <span className="text-[11px] text-[#7E7E7E] font-bold block mt-1.5">per adult</span>
        </div>

      </div>

      {/* Secondary Details & Offer Strip - White background, dashed top border */}
      <div className="bg-white border-t border-dashed border-[#EAEAEA] px-5.5 py-3 flex flex-wrap items-center justify-between gap-3 select-none">
        
        {/* Amenities & Discounts tags - all in clean grey style */}
        <div className="flex flex-wrap items-center gap-5 text-[12px] font-bold text-[#6B6B6B]">
          <span className="flex items-center space-x-1.5">
            <Tag className="w-3.5 h-3.5 text-[#7E7E7E]" />
            <span>{flight.save}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span>{flight.flexi}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#7E7E7E]" />
            <span>{flight.business}</span>
          </span>
        </div>

        {/* Right side items: Select button (no Cheap/Fast badges) */}
        <div className="flex items-center space-x-3.5 ml-auto">
          <button 
            onClick={onSelect}
            className="w-[160px] h-[40px] rounded-lg bg-[#FF2D1A] hover:bg-red-700 text-white font-black text-[13px] tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center select-none"
          >
            Select
          </button>
        </div>

      </div>

    </div>
  );
}
