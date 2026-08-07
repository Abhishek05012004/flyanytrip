/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/BookingInfo.jsx
 * DESCRIPTION: Passenger details and contact information input form (Step 1).
 * ============================================================================
 */

import React from "react";
import { Mail, Phone, User, Calendar, Flag, Plus, ChevronDown } from "lucide-react";

export default function BookingInfo({ onContinue }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue();
  };

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

      {/* 2. Passenger Details Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-[32px] shadow-2xs font-inter">
        <h3 className="text-[18.57px] font-bold text-[#1A1A1A] mb-1 font-inter">Passenger Details</h3>
        <p className="text-[15.09px] text-[#666666] font-normal mb-6 font-inter">Enter passenger details as per government ID</p>

        <div className="relative mb-6">
          <div className="flex items-center space-x-2 pb-3 mb-6 border-b border-[#EAEAEA] text-[#333333] font-semibold text-[16.25px] select-none">
            <img src="/assets/home/header/icons/login.svg" alt="passenger" className="w-[16px] h-[16px] mr-2 flex-shrink-0 opacity-60" />
            <span>Passenger 1 – Adult</span>
          </div>

          {/* Form details inputs */}
          <div className="space-y-5">

            {/* Title, First Name, Last Name row */}
            <div className="flex flex-wrap md:flex-nowrap gap-[24px]">

              {/* Title dropdown */}
              <div className="text-left w-full md:w-[113px] flex-shrink-0 relative">
                <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Title *</span>
                <div className="relative">
                  <select className="w-full h-[50px] bg-white border border-[#EAEAEA] rounded-lg pl-4 pr-8 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none cursor-pointer appearance-none">
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#666666] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* First Name */}
              <div className="text-left flex-grow">
                <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">First Name *</span>
                <input
                  type="text"
                  required
                  defaultValue="Rahul"
                  placeholder="Enter first name"
                  className="w-full h-[50px] bg-white border border-[#EAEAEA] rounded-lg px-4 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none placeholder-[#757575]"
                />
              </div>

              {/* Last Name */}
              <div className="text-left flex-grow">
                <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Last Name *</span>
                <input
                  type="text"
                  required
                  defaultValue="Sharma"
                  placeholder="Enter last name"
                  className="w-full h-[50px] bg-white border border-[#EAEAEA] rounded-lg px-4 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none placeholder-[#757575]"
                />
              </div>

            </div>

            {/* Date of Birth and Nationality row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">

              {/* Date of Birth */}
              <div className="text-left">
                <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Date of Birth *</span>
                <div className="flex border border-[#EAEAEA] rounded-lg bg-white items-center px-4 h-[50px]">
                  <img src="/assets/home/hero/icons/calendar.svg" alt="calendar" className="w-[16px] h-[16px] mr-2.5 flex-shrink-0 opacity-60" />
                  <input
                    type="text"
                    required
                    defaultValue="15 / 08 / 1990"
                    placeholder="DD / MM / YYYY"
                    className="w-full py-2 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none placeholder-[#757575]"
                  />
                </div>
              </div>

              {/* Nationality */}
              <div className="text-left relative">
                <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Nationality *</span>
                <div className="relative">
                  <select className="w-full h-[50px] bg-white border border-[#EAEAEA] rounded-lg pl-4 pr-8 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none cursor-pointer appearance-none">
                    <option>Indian</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#666666] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

          </div>

          {/* Passport details */}
          <div className="border-t border-[#EAEAEA] pt-6 mt-6">
            <span className="text-[13.93px] font-normal text-[#666666] block mb-4 select-none font-inter">
              Passport details required for international flights
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {/* Passport Number */}
              <div className="text-left">
                <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Passport Number</span>
                <input
                  type="text"
                  placeholder="Enter passport number"
                  className="w-full h-[50px] bg-white border border-[#EAEAEA] rounded-lg px-4 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none placeholder-[#757575]"
                />
              </div>

              {/* Passport Expiry */}
              <div className="text-left">
                <span className="text-[13.93px] font-normal text-[#666666] block mb-2 font-inter">Passport Expiry</span>
                <div className="flex border border-[#EAEAEA] rounded-lg bg-white items-center px-4 h-[50px]">
                  <img src="/assets/home/hero/icons/calendar.svg" alt="calendar" className="w-[16px] h-[16px] mr-2.5 flex-shrink-0 opacity-60" />
                  <input
                    type="text"
                    placeholder="DD / MM / YYYY"
                    className="w-full py-2 text-[16.25px] font-normal text-[#1A1A1A] focus:outline-none placeholder-[#757575]"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Add Another Passenger Button */}
        <button
          type="button"
          className="w-full h-[55px] border border-dashed border-[#EAEAEA] hover:border-gray-400 rounded-xl text-[16.25px] font-semibold text-[#666666] transition-all flex items-center justify-center space-x-2 cursor-pointer bg-white"
        >
          <span className="font-bold text-lg leading-none">+</span>
          <span>Add Another Passenger</span>
        </button>
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
