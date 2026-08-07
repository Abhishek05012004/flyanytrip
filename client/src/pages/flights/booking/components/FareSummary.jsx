/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/FareSummary.jsx
 * DESCRIPTION: Dedicated live fare summary card.
 * ============================================================================
 */

import React from "react";

export default function FareSummary({
  basePrice,
  taxes,
  additionalAmount,
  totalAmount,
  discount,
  promoCode
}) {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-2xs text-left font-inter select-none">
      <h3 className="text-[18.57px] font-bold text-[#1A1A1A] mb-1 font-inter">Fare Summary</h3>
      <p className="text-[15.09px] text-[#666666] font-normal mb-5 font-inter">Live-updating fare details</p>

      <div className="space-y-4 text-[16.25px] font-normal text-[#333333]">
        <div className="flex justify-between items-center">
          <span className="font-inter">Base Fare</span>
          <span className="font-inter">₹{basePrice.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-inter">Taxes &amp; Fees</span>
          <span className="font-inter">₹{taxes.toLocaleString()}</span>
        </div>

        {/* Render extra add-ons only if they are positive */}
        {additionalAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span className="font-semibold">Add-on Services</span>
            <span>+₹{additionalAmount.toLocaleString()}</span>
          </div>
        )}

        {/* Render promo code only if it is positive */}
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50 text-sm font-semibold">
            <span>Promo ({promoCode})</span>
            <span className="font-bold">-₹{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-[#EAEAEA] pt-4.5 flex justify-between items-center text-[20.90px] font-bold text-[#1A1A1A] mt-5">
          <span className="font-inter">Total</span>
          <span className="font-inter">₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
