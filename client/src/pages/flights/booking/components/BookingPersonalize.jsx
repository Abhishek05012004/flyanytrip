/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/BookingPersonalize.jsx
 * DESCRIPTION: Meals, add-ons, and travel insurance selector (Step 3).
 * ============================================================================
 */

import React, { useState } from "react";
import {
  Utensils,
  Leaf,
  Drumstick,
  Sprout,
  Wheat,
  Minus,
  Luggage,
  Zap,
  Wifi,
  ShieldCheck,
  Check
} from "lucide-react";

export default function BookingPersonalize({ onContinue, onAddonsUpdate }) {
  // Meals row configs
  const mealsRow1 = [
    { id: "veg", label: "Vegetarian", price: 299, emoji: "🥗" },
    { id: "nonveg", label: "Non-Vegetarian", price: 349, emoji: "🍗" },
    { id: "vegan", label: "Vegan", price: 329, emoji: "🌱" }
  ];
  const mealsRow2 = [
    { id: "jain", label: "Jain", price: 299, emoji: "🫘" },
    { id: "none", label: "No Preference", price: 0, emoji: "—" }
  ];

  // Add-on services config list
  const addonsList = [
    {
      id: "bag_15",
      label: "Extra Baggage — 15 kg",
      price: 799,
      desc: "Add 1 check-in bag",
      icon: <Luggage className="w-[18px] h-[18px]" />,
      badge: null
    },
    {
      id: "bag_30",
      label: "Extra Baggage — 30 kg",
      price: 1399,
      desc: "Add 2 check-in bags",
      icon: <Luggage className="w-[18px] h-[18px]" />,
      badge: "Better value"
    },
    {
      id: "priority",
      label: "Priority Boarding",
      price: 299,
      desc: "Board first, best overhead bin space",
      icon: <Zap className="w-[18px] h-[18px]" />,
      badge: "Popular"
    },
    {
      id: "wifi",
      label: "In-flight Wi-Fi",
      price: 499,
      desc: "Stay connected during the flight",
      icon: <Wifi className="w-[18px] h-[18px]" />,
      badge: null
    }
  ];

  // States
  const [selectedMeal, setSelectedMeal] = useState("none");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isInsuranceAdded, setIsInsuranceAdded] = useState(false);

  // Update dynamic price logic
  const handleMealSelect = (mealId) => {
    setSelectedMeal(mealId);
    triggerPriceUpdate(mealId, selectedAddons, isInsuranceAdded);
  };

  const handleAddonClick = (addonId) => {
    const isAlreadyAdded = selectedAddons.includes(addonId);
    let updated;
    if (isAlreadyAdded) {
      updated = selectedAddons.filter(id => id !== addonId);
    } else {
      updated = [...selectedAddons, addonId];
    }
    setSelectedAddons(updated);
    triggerPriceUpdate(selectedMeal, updated, isInsuranceAdded);
  };

  const handleInsuranceClick = () => {
    const updated = !isInsuranceAdded;
    setIsInsuranceAdded(updated);
    triggerPriceUpdate(selectedMeal, selectedAddons, updated);
  };

  const triggerPriceUpdate = (mealId, addons, insurance) => {
    const allMeals = [...mealsRow1, ...mealsRow2];
    const mealPrice = allMeals.find(m => m.id === mealId)?.price || 0;
    const addonsPrice = addons.reduce((sum, aId) => {
      const price = addonsList.find(item => item.id === aId)?.price || 0;
      return sum + price;
    }, 0);
    const insurancePrice = insurance ? 149 : 0;

    // Dispatch total additional sum up to parent
    onAddonsUpdate({
      meal: mealId,
      addons: addons,
      insurance: insurance,
      totalAdditional: mealPrice + addonsPrice + insurancePrice
    });
  };

  return (
    <div className="space-y-6 font-inter text-left">

      {/* 1. Meal Preferences Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-[32px] shadow-2xs font-inter">
        <div className="flex justify-between items-center mb-5 select-none">
          <h3 className="text-[18.57px] font-bold text-[#1A1A1A] flex items-center space-x-2 font-inter">
            <Utensils className="w-4.5 h-4.5 text-gray-400" />
            <span>Meal Preference</span>
            <span className="text-[11.25px] text-[#6B6B6B] font-medium bg-[#F0F0F0] px-2.5 py-0.5 rounded-full ml-2">
              Pre-order &amp; save
            </span>
          </h3>
        </div>

        <div className="space-y-[11px]">
          {/* Row 1: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[11px]">
            {mealsRow1.map((meal) => {
              const isSelected = selectedMeal === meal.id;
              return (
                <button
                  type="button"
                  key={meal.id}
                  onClick={() => handleMealSelect(meal.id)}
                  className={`border rounded-lg p-[13.125px] h-[58px] text-left cursor-pointer transition-all flex items-center justify-between font-inter ${isSelected
                      ? "border-[#FF2D1A] bg-[#FFF5F4]"
                      : "border-[#EAEAEA] hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className="flex items-center space-x-[11.25px] select-none overflow-hidden">
                    <span className="text-[18.75px] leading-none flex-shrink-0">{meal.emoji}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.25px] font-bold text-[#333333] leading-normal truncate">{meal.label}</span>
                      <span className="text-[11.25px] font-medium text-[#6B6B6B] leading-none mt-0.5">
                        {meal.price === 0 ? "Free" : `+₹${meal.price}`}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-[16px] h-[16px] text-[#FF2D1A] stroke-[3] ml-2 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Row 2: 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[11px]">
            {mealsRow2.map((meal) => {
              const isSelected = selectedMeal === meal.id;
              return (
                <button
                  type="button"
                  key={meal.id}
                  onClick={() => handleMealSelect(meal.id)}
                  className={`border rounded-lg p-[13.125px] h-[59px] text-left cursor-pointer transition-all flex items-center justify-between font-inter ${isSelected
                      ? "border-[#FF2D1A] bg-[#FFF5F4]"
                      : "border-[#EAEAEA] hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className="flex items-center space-x-[11.25px] select-none overflow-hidden">
                    <span className="text-[18.75px] leading-none flex-shrink-0">{meal.emoji}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.25px] font-bold text-[#333333] leading-normal truncate">{meal.label}</span>
                      <span className="text-[11.25px] font-medium text-[#6B6B6B] leading-none mt-0.5">
                        {meal.price === 0 ? "Free" : `+₹${meal.price}`}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-[16px] h-[16px] text-[#FF2D1A] stroke-[3] ml-2 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Add-on Services Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-[32px] shadow-2xs font-inter">
        <h3 className="text-[18.57px] font-bold text-[#1A1A1A] mb-5 flex items-center space-x-2 select-none font-inter">
          <Luggage className="w-4.5 h-4.5 text-gray-400" />
          <span>Add-on Service</span>
        </h3>

        <div className="space-y-[11.25px]">
          {addonsList.map((addon) => {
            const isAdded = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                className="border border-[#D0D0D0] rounded-xl p-[15px] h-[70px] flex items-center justify-between gap-4 bg-white font-inter"
              >

                {/* Left Visual Icon + Description */}
                <div className="flex items-center space-x-[11.25px]">
                  {/* Left Colored Icon box */}
                  <div className="w-[38px] h-[38px] rounded-lg bg-[#FFD9D9] flex items-center justify-center flex-shrink-0 select-none">
                    {React.cloneElement(addon.icon, { className: "w-[18px] h-[18px] text-[#FF2D1A]" })}
                  </div>

                  <div className="text-left select-none">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-[13.125px] text-[#1A1A1A]">{addon.label}</h4>
                      {addon.badge && (
                        <span className="bg-[#F0F0F0] text-[#6B6B6B] text-[11.25px] font-bold px-2.5 py-0.5 rounded-full">
                          {addon.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.25px] text-[#6B6B6B] font-medium mt-0.5">{addon.desc}</p>
                  </div>
                </div>

                {/* Right price and action */}
                <div className="flex items-center space-x-[11.25px] flex-shrink-0">
                  <span className="text-[13.125px] font-bold text-[#1A1A1A]">+₹{addon.price}</span>
                  <button
                    type="button"
                    onClick={() => handleAddonClick(addon.id)}
                    className={`text-[11.25px] font-bold rounded-[13.375px] cursor-pointer h-[28px] w-[63px] flex items-center justify-center border transition-all whitespace-nowrap ${isAdded
                        ? "bg-[#FF2D1A] border-[#FF2D1A] text-white"
                        : "bg-[#FFEFEF] border-[#FF8484] hover:bg-[#FFE5E5] text-[#E53935]"
                      }`}
                  >
                    {isAdded ? "Added" : "+ Add"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Travel Insurance Card */}
      <div className="bg-white border border-[#D0D0D0] rounded-2xl p-[18.75px] h-[77px] shadow-2xs select-none font-inter">
        <div className="flex items-center justify-between gap-4 h-full">

          {/* Left Details */}
          <div className="flex items-center space-x-[11.25px]">
            {/* Shield Check green icon box */}
            <div className="w-[38px] h-[38px] rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-[18px] h-[18px] text-[#00A63E]" />
            </div>

            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-[13.125px] font-bold text-[#1A1A1A]">Travel Insurance</span>
                <span className="bg-[#00C950] text-white text-[11.25px] font-bold px-2.5 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="text-[11.25px] text-[#6B6B6B] font-medium mt-0.5">
                ₹5L coverage · Trip cancellation · Medical emergency · Baggage loss
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center space-x-[11.25px] flex-shrink-0">
            <span className="text-[13.125px] font-bold text-[#1A1A1A]">₹149</span>
            <button
              type="button"
              onClick={handleInsuranceClick}
              className={`text-[11.25px] font-bold rounded-[13.375px] cursor-pointer h-[28px] w-[63px] flex items-center justify-center border transition-all whitespace-nowrap ${isInsuranceAdded
                  ? "bg-[#00A63E] border-[#00A63E] text-white"
                  : "bg-[#FF2D1A] border-[#D0D0D0] hover:bg-red-700 text-white"
                }`}
            >
              {isInsuranceAdded ? "Added" : "+ Add"}
            </button>
          </div>

        </div>
      </div>

      {/* Continue CTA */}
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
