import express from "express";
import {
  getFlightLocationsAPI,
  searchFlightsAPI,
  getCalendarFareAPI,
  updateCalendarFareOfDayAPI,
  getFareQuoteAPI,
  getFareRulesAPI,
  getSSRAPI,
  bookLCCTicketAPI,
  bookNonLCCAPI,
  issueNonLCCTicketAPI,
  releaseHoldBookingAPI,
  getBookingDetailsAPI,
  getCancellationChargesAPI,
  cancelBookingAPI,
  getCancellationStatusAPI
} from "../services/adivaha.js";

const router = express.Router();

// Autocomplete flight locations lookup
router.get("/locations", async (req, res, next) => {
  try {
    const { term, limit } = req.query;
    if (!term) {
      return res.status(400).json({ success: false, message: "Search term is required" });
    }
    const limitVal = limit ? parseInt(limit, 10) : 5;
    const data = await getFlightLocationsAPI(term, limitVal);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Helper to map UI cabin class to provider-specific value
const mapCabinClass = (cls) => {
  if (!cls) return "Economy";
  const normalized = cls.toLowerCase().replace(/[\s_-]/g, "");
  if (normalized.includes("premium")) return "PremiumEconomy";
  if (normalized.includes("business")) return "Business";
  if (normalized.includes("first")) return "First";
  return "Economy";
};

// Search flights
router.post("/search", async (req, res, next) => {
  try {
    const {
      adults,
      children,
      infants,
      isoneway,
      From_IATACODE,
      To_IATACODE,
      departure_date,
      return_date,
      flights_category
    } = req.body;

    // Validation
    if (!From_IATACODE || !To_IATACODE || !departure_date) {
      return res.status(400).json({
        success: false,
        message: "From_IATACODE, To_IATACODE, and departure_date are required fields"
      });
    }

    const searchParams = {
      adults: adults ? String(adults) : "1",
      children: children ? String(children) : "0",
      infants: infants ? String(infants) : "0",
      isoneway: isoneway || "Yes",
      From_IATACODE,
      To_IATACODE,
      departure_date,
      return_date: return_date || "",
      flights_category: mapCabinClass(flights_category)
    };

    const data = await searchFlightsAPI(searchParams);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get calendar fares
router.post("/calendar-fares", async (req, res, next) => {
  try {
    const { From_IATACODE, To_IATACODE, departure_date, flights_category } = req.body;
    if (!From_IATACODE || !To_IATACODE || !departure_date) {
      return res.status(400).json({
        success: false,
        message: "From_IATACODE, To_IATACODE, and departure_date are required fields"
      });
    }
    const data = await getCalendarFareAPI({
      From_IATACODE,
      To_IATACODE,
      departure_date,
      flights_category: mapCabinClass(flights_category)
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Update calendar fare of the day
router.post("/update-calendar-fare", async (req, res, next) => {
  try {
    const { From_IATACODE, To_IATACODE, departure_date, flights_category } = req.body;
    if (!From_IATACODE || !To_IATACODE || !departure_date) {
      return res.status(400).json({
        success: false,
        message: "From_IATACODE, To_IATACODE, and departure_date are required fields"
      });
    }
    const data = await updateCalendarFareOfDayAPI({
      From_IATACODE,
      To_IATACODE,
      departure_date,
      flights_category: mapCabinClass(flights_category)
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Flight Fare Quote
router.post("/fare-quote", async (req, res, next) => {
  try {
    const { TraceId, ResultIndex } = req.body;
    if (!TraceId || !ResultIndex) {
      return res.status(400).json({ success: false, message: "TraceId and ResultIndex are required" });
    }
    const data = await getFareQuoteAPI({ TraceId, ResultIndex });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Flight Fare Rules
router.post("/fare-rules", async (req, res, next) => {
  try {
    const { TraceId, ResultIndex } = req.body;
    if (!TraceId || !ResultIndex) {
      return res.status(400).json({ success: false, message: "TraceId and ResultIndex are required" });
    }
    const data = await getFareRulesAPI({ TraceId, ResultIndex });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Flight SSR (Special Service Request - Meals, Baggage, Seats)
router.post("/ssr", async (req, res, next) => {
  try {
    const { TraceId, ResultIndex } = req.body;
    if (!TraceId || !ResultIndex) {
      return res.status(400).json({ success: false, message: "TraceId and ResultIndex are required" });
    }
    const data = await getSSRAPI({ TraceId, ResultIndex });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// LCC Ticket Booking
router.post("/book-lcc", async (req, res, next) => {
  try {
    const data = await bookLCCTicketAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Non-LCC Flight Book (Hold)
router.post("/book-non-lcc", async (req, res, next) => {
  try {
    const data = await bookNonLCCAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Non-LCC Ticket Issue
router.post("/issue-ticket", async (req, res, next) => {
  try {
    const data = await issueNonLCCTicketAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Release or Cancel Hold Booking
router.post("/release-hold", async (req, res, next) => {
  try {
    const data = await releaseHoldBookingAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get Booking Details
router.post("/booking-details", async (req, res, next) => {
  try {
    const data = await getBookingDetailsAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get Cancellation Charges
router.post("/cancellation-charges", async (req, res, next) => {
  try {
    const data = await getCancellationChargesAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Cancel Booking
router.post("/cancel-booking", async (req, res, next) => {
  try {
    const data = await cancelBookingAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get Cancellation Status
router.post("/cancellation-status", async (req, res, next) => {
  try {
    const data = await getCancellationStatusAPI(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;

