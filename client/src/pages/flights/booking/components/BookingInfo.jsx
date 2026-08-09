/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/BookingInfo.jsx
 * DESCRIPTION: Passenger details and contact information input form (Step 1).
 * ============================================================================
 */

import React from "react";
import { Mail, Phone, User, Calendar, Flag, Plus, ChevronDown } from "lucide-react";

export default function BookingInfo({ onContinue, adultsCount = 1, childrenCount = 0, infantsCount = 0 }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue();
  };

  const adultArr = Array.from({ length: Math.max(1, parseInt(adultsCount, 10) || 1) });
  const childArr = Array.from({ length: Math.max(0, parseInt(childrenCount, 10) || 0) });
  const infantArr = Array.from({ length: Math.max(0, parseInt(infantsCount, 10) || 0) });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-left">

      {/* 1. Contact Information Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-[32px] shadow-2xs font-inter">
        <h3 className="text-[18.57px] font-bold text-[#1A1A1A] mb-1 font-inter">Contact Information</h3>
        <p className="text-[15.09px] text-[#666666] font-normal mb-6 font-inter">We will send booking details to this contact</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {/* Mobile input */}
          <div className="text-left">
            <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Mobile Number *</span>
            <div className="flex items-center space-x-2.5">
              {/* Country Code Dropdown */}
              <div className="relative flex-shrink-0 w-[107px]">
                <select className="w-full h-[50px] bg-white border border-[#EAEAEA] rounded-lg pl-4 pr-8 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none cursor-pointer appearance-none">
                  <option>+91</option>
                  <option>+1</option>
                  <option>+44</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#666666] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                required
                defaultValue="98765 43210"
                placeholder="Enter mobile number"
                className="w-full h-[50px] bg-white border border-[#EAEAEA] rounded-lg px-4 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none placeholder-[#757575]"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="text-left">
            <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Email Address *</span>
            <div className="flex border border-[#EAEAEA] rounded-lg bg-white items-center px-4 h-[50px]">
              <Mail className="w-[16.25px] h-[16.25px] text-[#666666] mr-2.5 flex-shrink-0" />
              <input
                type="email"
                required
                defaultValue="you@email.com"
                placeholder="Enter email address"
                className="w-full py-2 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none placeholder-[#757575]"
              />
            </div>
          </div>
        </div>

        {/* Checkbox confirmation */}
        <label className="flex items-center space-x-3.5 mt-[24px] text-[15.09px] font-normal text-[#666666] cursor-pointer select-none">
          <input 
            type="checkbox" 
            defaultChecked 
            className="w-[19px] h-[19px] rounded-xs border border-gray-300 accent-[#FF2D1A] cursor-pointer flex-shrink-0" 
          />
          <span className="font-inter">Send booking confirmation and ticket details to this email address</span>
        </label>
      </div>

      {/* 2. Passenger Details Section (EaseMyTrip Style) */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-[28px] shadow-2xs font-inter space-y-6">
        
        {/* Header with ID proof notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAEAEA]">
          <div>
            <h3 className="text-[18.57px] font-bold text-[#1A1A1A] font-inter">Travellers Details</h3>
            <p className="text-[13.5px] text-[#666666] font-normal font-inter">Enter passenger details as per government ID</p>
          </div>
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#1D4ED8] flex items-center space-x-2 select-none self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            <span>Name should be same as in government ID proof</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* CATEGORY 1: ADULT                                                         */}
        {/* ------------------------------------------------------------------------- */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-extrabold text-[#555555] uppercase tracking-wider text-left font-inter">ADULT</h4>
          
          {adultArr.map((_, idx) => (
            <div key={`adult-${idx}`} className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-3xs">
              {/* Card Header Bar */}
              <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-5 py-3.5 flex items-center justify-between select-none">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#FF2D1A] flex items-center justify-center text-white">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-[15px] text-[#1E293B]">Adult {idx + 1}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#64748B]" />
              </div>

              {/* Card Inputs Body */}
              <div className="p-5 space-y-4">
                {/* Row 1: Title, First Name, Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-[110px_1fr_1fr] gap-[16px]">
                  <div className="text-left relative">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Title *</span>
                    <div className="relative">
                      <select className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg pl-3 pr-7 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] cursor-pointer appearance-none">
                        <option>Mr</option>
                        <option>Mrs</option>
                        <option>Ms</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">First &amp; Middle Name *</span>
                    <input
                      type="text"
                      required
                      defaultValue={idx === 0 ? "Rahul" : ""}
                      placeholder="Enter first & middle name"
                      className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                    />
                  </div>

                  <div className="text-left">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Last Name *</span>
                    <input
                      type="text"
                      required
                      defaultValue={idx === 0 ? "Sharma" : ""}
                      placeholder="Enter last name"
                      className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                    />
                  </div>
                </div>

                {/* Row 2: Code, Mobile Number, Email ID */}
                <div className="grid grid-cols-1 md:grid-cols-[110px_1fr_1fr] gap-[16px]">
                  <div className="text-left relative">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Code</span>
                    <div className="relative">
                      <select className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg pl-3 pr-7 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] cursor-pointer appearance-none">
                        <option>+91</option>
                        <option>+1</option>
                        <option>+44</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Contact Number (Optional)</span>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                    />
                  </div>

                  <div className="text-left">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Email ID (Optional)</span>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* CATEGORY 2: CHILD (Rendered only if childrenCount > 0)                    */}
        {/* ------------------------------------------------------------------------- */}
        {childArr.length > 0 && (
          <div className="space-y-4 pt-2">
            <h4 className="text-[13px] font-extrabold text-[#555555] uppercase tracking-wider text-left font-inter">CHILD</h4>
            
            {childArr.map((_, idx) => (
              <div key={`child-${idx}`} className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-3xs">
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-5 py-3.5 flex items-center justify-between select-none">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center text-white">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-[15px] text-[#1E293B]">Child {idx + 1} (2-12 Yrs)</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#64748B]" />
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-[110px_1fr_1fr] gap-[16px]">
                    <div className="text-left relative">
                      <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Title *</span>
                      <div className="relative">
                        <select className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg pl-3 pr-7 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] cursor-pointer appearance-none">
                          <option>Master</option>
                          <option>Miss</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">First &amp; Middle Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter first & middle name"
                        className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                      />
                    </div>

                    <div className="text-left">
                      <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Last Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter last name"
                        className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* CATEGORY 3: INFANT (Rendered only if infantsCount > 0)                   */}
        {/* ------------------------------------------------------------------------- */}
        {infantArr.length > 0 && (
          <div className="space-y-4 pt-2">
            <h4 className="text-[13px] font-extrabold text-[#555555] uppercase tracking-wider text-left font-inter">INFANT</h4>
            
            {infantArr.map((_, idx) => (
              <div key={`infant-${idx}`} className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-3xs">
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-5 py-3.5 flex items-center justify-between select-none">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center text-white">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-[15px] text-[#1E293B]">Infant {idx + 1} (0-2 Yrs)</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#64748B]" />
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-[110px_1fr_1fr] gap-[16px]">
                    <div className="text-left relative">
                      <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Title *</span>
                      <div className="relative">
                        <select className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg pl-3 pr-7 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] cursor-pointer appearance-none">
                          <option>Master</option>
                          <option>Miss</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">First &amp; Middle Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter first & middle name"
                        className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                      />
                    </div>

                    <div className="text-left">
                      <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Last Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter last name"
                        className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A] placeholder-[#94A3B8]"
                      />
                    </div>
                  </div>

                  <div className="text-left max-w-[280px]">
                    <span className="text-[12px] font-medium text-[#64748B] block mb-1.5 font-inter">Date of Birth * (Required for Infant)</span>
                    <input
                      type="date"
                      required
                      className="w-full h-[44px] bg-white border border-[#CBD5E1] rounded-lg px-3.5 text-[14px] font-medium text-[#0F172A] focus:outline-none focus:border-[#FF2D1A]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Continue CTA Button */}
      <button
        type="submit"
        className="w-full h-[60px] bg-[#FF2D1A] hover:bg-red-700 text-white font-semibold text-[18.57px] rounded-xl transition-all flex items-center justify-center space-x-3 shadow-sm select-none cursor-pointer active:scale-[0.99] font-inter"
      >
        <span>Continue</span>
        <svg className="w-[18.57px] h-[18.57px] text-white stroke-[3] fill-none" viewBox="0 0 24 24" stroke="currentColor">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

    </form>
  );
}
