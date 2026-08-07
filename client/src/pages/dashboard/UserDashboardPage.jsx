/**
 * ============================================================================
 * PATH: client/src/pages/dashboard/UserDashboardPage.jsx
 * DESCRIPTION: User dashboard, bookings list, and ticket retrieval
 * 
 * FIGMA MATCH: Navigation links for profile setting & tickets download lists.
 * ============================================================================
 */

import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

export default function UserDashboardPage() {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        <h2 className="text-3xl font-extrabold mb-8">My Bookings Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="bg-gray-900 border border-gray-800 rounded-xl p-6 h-fit space-y-4">
            <button className="w-full text-left font-semibold text-red-500 border-l-2 border-red-500 pl-3">Booking History</button>
            <button className="w-full text-left font-medium text-gray-400 hover:text-white transition-colors pl-3">Profile Settings</button>
          </aside>

          <main className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-6">Confirmed Trips</h3>
            <div className="border border-gray-850 bg-gray-950 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <span className="bg-red-950/50 text-red-400 border border-red-900/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">Flights</span>
                <h4 className="text-lg font-bold mt-2">New Delhi (DEL) &rarr; Mumbai (BOM)</h4>
                <p className="text-sm text-gray-500 mt-1">PNR: G5Y8HJ | Date: 25 Jul 2026</p>
              </div>
              <button className="mt-4 md:mt-0 bg-gray-800 hover:bg-gray-700 text-sm font-semibold px-4 py-2.5 rounded-lg border border-gray-750 transition-colors">
                Download Voucher
              </button>
            </div>
          </main>
        </div>
      </main>

      <Footer />
    </div>
  );
}
