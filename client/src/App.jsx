import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import FlightsResultPage from "./pages/flights/result/ResultPage";
import FlightBookingPage from "./pages/flights/booking/BookingPage";
import HotelsResultPage from "./pages/hotels/HotelsResultPage";
import HotelDetailsPage from "./pages/hotels/HotelDetailsPage";
import HotelBookingPage from "./pages/hotels/HotelBookingPage";
import PackagesResultPage from "./pages/packages/PackagesResultPage";
import PackageDetailsPage from "./pages/packages/PackageDetailsPage";
import PackageBookingPage from "./pages/packages/PackageBookingPage";
import VisaRedirectPage from "./pages/visa/VisaRedirectPage";
import PaymentPage from "./common/PaymentPage";
import FlightBookingSuccessPage from "./pages/flights/booking/FlightBookingSuccessPage";
import HotelBookingSuccessPage from "./pages/hotels/HotelBookingSuccessPage";
import PackageBookingSuccessPage from "./pages/packages/PackageBookingSuccessPage";
import BookingFailurePage from "./common/BookingFailurePage";
import LoginPage from "./pages/auth/LoginPage";
import UserDashboardPage from "./pages/dashboard/UserDashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HomePage (includes its header & footer) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Flights module routes */}
        <Route path="/flights" element={<FlightsResultPage />} />
        <Route path="/flights/book" element={<FlightBookingPage />} />
        
        {/* Hotels module routes */}
        <Route path="/hotels" element={<HotelsResultPage />} />
        <Route path="/hotels/:id" element={<HotelDetailsPage />} />
        <Route path="/hotels/book" element={<HotelBookingPage />} />
        
        {/* Tour Packages module routes */}
        <Route path="/packages" element={<PackagesResultPage />} />
        <Route path="/packages/:id" element={<PackageDetailsPage />} />
        <Route path="/packages/book" element={<PackageBookingPage />} />
        
        {/* Visa redirect page */}
        <Route path="/visa" element={<VisaRedirectPage />} />

        {/* Global checkout gateway, success & failure status pages */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/flights/booking-success" element={<FlightBookingSuccessPage />} />
        <Route path="/hotels/booking-success" element={<HotelBookingSuccessPage />} />
        <Route path="/packages/booking-success" element={<PackageBookingSuccessPage />} />
        <Route path="/booking-failure" element={<BookingFailurePage />} />

        {/* Auth & Dashboard */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}