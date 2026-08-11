import express from "express";
import prisma from "../config/db.js";
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

// Helper to save booking record to database
const saveBookingToDatabase = async (bookingDetails) => {
  try {
    const {
      bookingId,
      pnr,
      traceId,
      isLCC,
      paymentId,
      flightInfo = {},
      financials = {},
      passengers = [],
      addons = null,
      rawResponse = null,
      userEmail = null
    } = bookingDetails;

    let userId = null;
    if (userEmail) {
      // Find or create user
      const user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
          email: userEmail,
          name: passengers[0] ? `${passengers[0].FirstName || ''} ${passengers[0].LastName || ''}`.trim() : "Traveler"
        }
      });
      userId = user.id;
    }

    const saved = await prisma.booking.upsert({
      where: { bookingId: String(bookingId) },
      update: {
        pnr: pnr ? String(pnr) : undefined,
        status: "CONFIRMED",
        paymentStatus: "COMPLETED",
        paymentId: paymentId ? String(paymentId) : undefined,
        rawResponse: rawResponse || undefined
      },
      create: {
        bookingId: String(bookingId),
        pnr: pnr ? String(pnr) : null,
        traceId: traceId ? String(traceId) : null,
        type: "FLIGHT",
        isLCC: !!isLCC,
        status: "CONFIRMED",
        paymentStatus: "COMPLETED",
        paymentId: paymentId ? String(paymentId) : null,
        airlineName: flightInfo.airlineName || "Flight Provider",
        airlineCode: flightInfo.airlineCode || null,
        flightNumber: flightInfo.flightNumber || null,
        origin: flightInfo.origin || "DEL",
        destination: flightInfo.destination || "BOM",
        departureTime: flightInfo.departureTime ? new Date(flightInfo.departureTime) : null,
        arrivalTime: flightInfo.arrivalTime ? new Date(flightInfo.arrivalTime) : null,
        cabinClass: flightInfo.cabinClass || "Economy",
        basePrice: parseFloat(financials.basePrice || 0),
        taxes: parseFloat(financials.taxes || 0),
        totalAmount: parseFloat(financials.totalAmount || 0),
        currency: "INR",
        userId,
        passengers: passengers || [],
        addons: addons || null,
        rawResponse: rawResponse || null
      }
    });
    console.log(`[DB] Flight Booking successfully stored in database with ID: ${saved.id}`);
    return saved;
  } catch (err) {
    console.error("[DB Error] Failed to persist flight booking:", err);
    return null;
  }
};

// LCC Ticket Booking
router.post("/book-lcc", async (req, res, next) => {
  try {
    const { bookingPayload, meta } = req.body;
    // Accept either direct Adivaha payload or wrapped payload with metadata
    const providerPayload = bookingPayload || req.body;
    const data = await bookLCCTicketAPI(providerPayload);

    const providerResp = data?.responseData?.Response;
    const pnr = providerResp?.PNR || providerResp?.B2B2CPNR || meta?.pnr || ("FLY" + Math.random().toString(36).substring(2, 8).toUpperCase());
    const bookingId = providerResp?.BookingId || meta?.bookingId || ("BK" + Date.now());

    // Save to Database
    const dbRecord = await saveBookingToDatabase({
      bookingId,
      pnr,
      traceId: providerPayload.TraceId || meta?.traceId,
      isLCC: true,
      paymentId: meta?.paymentId,
      flightInfo: meta?.flightInfo,
      financials: meta?.financials,
      passengers: providerPayload.Passengers || meta?.passengers,
      addons: meta?.addons,
      rawResponse: data,
      userEmail: meta?.userEmail || providerPayload.Passengers?.[0]?.Email
    });

    res.json({
      ...data,
      dbBookingId: dbRecord?.id,
      pnr,
      bookingId
    });
  } catch (error) {
    next(error);
  }
});

// Non-LCC Flight Book (Hold)
router.post("/book-non-lcc", async (req, res, next) => {
  try {
    const { bookingPayload, meta } = req.body;
    const providerPayload = bookingPayload || req.body;
    const data = await bookNonLCCAPI(providerPayload);

    const providerResp = data?.responseData?.Response;
    const pnr = providerResp?.PNR || providerResp?.B2B2CPNR || meta?.pnr || ("FLY" + Math.random().toString(36).substring(2, 8).toUpperCase());
    const bookingId = providerResp?.BookingId || meta?.bookingId || ("BK" + Date.now());

    // Save initial hold booking to Database
    const dbRecord = await saveBookingToDatabase({
      bookingId,
      pnr,
      traceId: providerPayload.TraceId || meta?.traceId,
      isLCC: false,
      paymentId: meta?.paymentId,
      flightInfo: meta?.flightInfo,
      financials: meta?.financials,
      passengers: providerPayload.Passengers || meta?.passengers,
      addons: meta?.addons,
      rawResponse: data,
      userEmail: meta?.userEmail || providerPayload.Passengers?.[0]?.Email
    });

    res.json({
      ...data,
      dbBookingId: dbRecord?.id,
      pnr,
      bookingId
    });
  } catch (error) {
    next(error);
  }
});

// Non-LCC Ticket Issue
router.post("/issue-ticket", async (req, res, next) => {
  try {
    const data = await issueNonLCCTicketAPI(req.body);
    const providerResp = data?.responseData?.Response;
    if (providerResp && req.body.BookingId) {
      await saveBookingToDatabase({
        bookingId: req.body.BookingId,
        pnr: providerResp.PNR || req.body.PNR,
        rawResponse: data
      });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Fetch user bookings from Database
router.get("/my-bookings", async (req, res, next) => {
  try {
    const { email } = req.query;
    let bookings = [];
    if (email) {
      bookings = await prisma.booking.findMany({
        where: { user: { email } },
        orderBy: { createdAt: "desc" }
      });
    } else {
      bookings = await prisma.booking.findMany({
        take: 20,
        orderBy: { createdAt: "desc" }
      });
    }
    res.json({ success: true, bookings });
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
    if (req.body.BookingId) {
      await prisma.booking.updateMany({
        where: { bookingId: String(req.body.BookingId) },
        data: { status: "CANCELLED" }
      });
    }
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

