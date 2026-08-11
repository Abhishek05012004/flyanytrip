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

export default function BookingPersonalize({ onContinue, onAddonsUpdate, ssrData, loadingSSR }) {
  // Parse API Meals if available
  const apiMealItems = [];
  if (Array.isArray(ssrData?.MealDynamic)) {
    ssrData.MealDynamic.forEach(legMeals => {
      if (Array.isArray(legMeals)) {
        legMeals.forEach(meal => {
          if (meal.Code && meal.Code !== "NoMeal" && !apiMealItems.some(m => m.id === meal.Code)) {
            apiMealItems.push({
              id: meal.Code,
              label: meal.AirlineDescription || meal.Code,
              price: meal.Price || 0,
              emoji: "🍱",
              rawObj: meal
            });
          }
        });
      }
    });
  }

  // Parse API Baggage if available
  const apiBaggageItems = [];
  if (Array.isArray(ssrData?.Baggage)) {
    ssrData.Baggage.forEach(legBaggage => {
      if (Array.isArray(legBaggage)) {
        legBaggage.forEach(bag => {
          if (bag.Code && bag.Code !== "NoBaggage" && bag.Price > 0 && !apiBaggageItems.some(b => b.id === bag.Code)) {
            apiBaggageItems.push({
              id: bag.Code,
              label: bag.Text ? bag.Text.replace(/\n/g, ' ') : `Extra Baggage ${bag.Weight} KG`,
              price: bag.Price || 0,
              desc: `Add extra baggage (${bag.Weight} KG)`,
              badge: bag.Weight >= 15 ? "Popular" : null,
              rawObj: bag
            });
          }
        });
      }
    });
  }

  const activeMealsList = apiMealItems.length > 0
    ? [{ id: "none", label: "No Meal Preference", price: 0, emoji: "—" }, ...apiMealItems]
    : [];

  const activeAddonsList = apiBaggageItems;

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
    const selectedMealObj = activeMealsList.find(m => m.id === mealId);
    const mealPrice = selectedMealObj?.price || 0;

    const addonsPrice = addons.reduce((sum, aId) => {
      const price = activeAddonsList.find(item => item.id === aId)?.price || 0;
      return sum + price;
    }, 0);
    const insurancePrice = insurance ? 149 : 0;

    // Dispatch total additional sum up to parent
    onAddonsUpdate({
      meal: mealId,
      mealObj: selectedMealObj?.rawObj || null,
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

        {loadingSSR ? (
          <div className="py-8 text-center text-gray-500 font-medium text-xs space-y-2">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Loading meal options from airline...</p>
          </div>
        ) : activeMealsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[11px]">
            {activeMealsList.map((meal) => {
              const isSelected = selectedMeal === meal.id;
              return (
                <button
                  type="button"
                  key={meal.id}
                  onClick={() => handleMealSelect(meal.id)}
                  className={`border rounded-lg p-[13.125px] min-h-[58px] text-left cursor-pointer transition-all flex items-center justify-between font-inter ${isSelected
                    ? "border-[#FF2D1A] bg-[#FFF5F4]"
                    : "border-[#EAEAEA] hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className="flex items-center space-x-[11.25px] select-none overflow-hidden pr-2">
                    <span className="text-[18.75px] leading-none flex-shrink-0">{meal.emoji || "🍱"}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11.25px] font-bold text-[#333333] leading-normal line-clamp-2">{meal.label}</span>
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
        ) : (
          <p className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
            Pre-booked meal options are not offered by the airline for this specific flight route. In-flight purchase may be available.
          </p>
        )}
      </div>

      {/* 2. Add-on Services Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-[32px] shadow-2xs font-inter">
        <h3 className="text-[18.57px] font-bold text-[#1A1A1A] mb-5 flex items-center space-x-2 select-none font-inter">
          <Luggage className="w-4.5 h-4.5 text-gray-400" />
          <span>Add-on Service</span>
        </h3>

        {loadingSSR ? (
          <div className="py-8 text-center text-gray-500 font-medium text-xs space-y-2">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Loading baggage add-ons from airline...</p>
          </div>
        ) : activeAddonsList.length > 0 ? (
          <div className="space-y-[11.25px]">
            {activeAddonsList.map((addon) => {
              const isAdded = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  className="border border-[#D0D0D0] rounded-xl p-[15px] min-h-[70px] flex items-center justify-between gap-4 bg-white font-inter"
                >

                  {/* Left Visual Icon + Description */}
                  <div className="flex items-center space-x-[11.25px]">
                    {/* Left Colored Icon box */}
                    <div className="w-[38px] h-[38px] rounded-lg bg-[#FFD9D9] flex items-center justify-center flex-shrink-0 select-none">
                      <Luggage className="w-[18px] h-[18px] text-[#FF2D1A]" />
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
                      {addon.desc && <p className="text-[11.25px] text-[#6B6B6B] font-medium mt-0.5">{addon.desc}</p>}
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
        ) : (
          <p className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
            No extra check-in baggage add-ons available for pre-purchase from the airline for this fare class.
          </p>
        )}
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