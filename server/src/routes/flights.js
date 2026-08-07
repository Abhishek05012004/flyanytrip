import express from "express";
import { getFlightLocationsAPI, searchFlightsAPI, getCalendarFareAPI, updateCalendarFareOfDayAPI } from "../services/adivaha.js";

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

export default router;
