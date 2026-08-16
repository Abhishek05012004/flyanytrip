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
  getCancellationStatusAPI,
  getWalletBalanceAPI
} from "../services/adivaha.js";
import { generateBookingPDF } from "../services/pdf.js";
import { sendBookingVoucherEmail } from "../services/email.js";

const router = express.Router();

// Get Wallet Balance — used to show/verify the sandbox (test) wallet balance
// that Adivaha deducts test bookings from before a payment is confirmed.
router.get("/wallet-balance", async (req, res, next) => {
  try {
    const data = await getWalletBalanceAPI();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

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

// Helper to save booking record to database.
// `status` lets callers distinguish a real ticketed CONFIRMED booking from a
// Non-LCC HOLD that hasn't been ticketed yet (PENDING) or an attempt that
// the provider actually rejected (FAILED) — previously this always wrote
// "CONFIRMED" no matter what actually happened with Adivaha, which is how a
// provider-side error still ended up looking like a confirmed booking in
// the database.
const saveBookingToDatabase = async (bookingDetails) => {
  try {
    const {
      bookingId,
      pnr,
      traceId,
      isLCC,
      paymentId,
      status = "CONFIRMED",
      paymentStatus = "COMPLETED",
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
        status,
        paymentStatus,
        paymentId: paymentId ? String(paymentId) : undefined,
        rawResponse: rawResponse || undefined
      },
      create: {
        bookingId: String(bookingId),
        pnr: pnr ? String(pnr) : null,
        traceId: traceId ? String(traceId) : null,
        type: "FLIGHT",
        isLCC: !!isLCC,
        status,
        paymentStatus,
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
    console.log(`[DB] Flight Booking stored in database with ID: ${saved.id} (status=${status})`);
    return saved;
  } catch (err) {
    console.error("[DB Error] Failed to persist flight booking:", err);
    return null;
  }
};

// Inspects an Adivaha response for a provider-side booking failure.
// Adivaha almost never uses HTTP error codes — a rejected fare, expired
// TraceId, or failed ticketing all come back as HTTP 200 with either
// Response.Error.ErrorCode !== 0, Response.ResponseStatus === 0, or a
// Response.Status that isn't 0/1 (e.g. 7605 = "fare no longer available").
// This mirrors the exact same check the client already does in
// PaymentPage.jsx after receiving the booking response — duplicated here so
// the *server* also treats it as a failure instead of blindly saving a
// "CONFIRMED" row and emailing a voucher for a booking Adivaha itself
// rejected.
const getProviderBookingError = (data) => {
  const respObj = data?.responseData?.Response || data?.responseData || null;
  const rawStatus = data?.Status ?? respObj?.Status ?? respObj?.Error?.ErrorCode;
  const statusMsg = data?.status_message || respObj?.status_message || respObj?.Error?.ErrorMessage;
  const isError = rawStatus === 7605 || (rawStatus !== undefined && rawStatus !== null && rawStatus !== 0 && rawStatus !== 1);
  return { isError, rawStatus, statusMsg };
};

// Helper: verify the (sandbox) wallet has enough balance to cover this booking
// before we call Adivaha's ticketing endpoint. Adivaha's booking APIs don't
// reliably surface "insufficient balance" as a distinct error, so checking
// GetWalletBalance first avoids attempting a ticket issue that will just fail
// and leave the booking in a confusing half-completed state.
const assertWalletCanCover = async (totalAmount) => {
  if (!totalAmount || Number(totalAmount) <= 0) return; // nothing to verify against
  const walletData = await getWalletBalanceAPI().catch((err) => {
    console.warn("[Wallet] Could not verify balance before booking, proceeding anyway:", err.message);
    return null;
  });
  if (!walletData) return; // fail-open: don't block booking if the balance check itself failed

  // In test/sandbox mode Adivaha deducts from test_wallet_balance instead of
  // wallet_balance, so prefer that figure when it is present.
  const balanceStr = walletData.test_wallet_balance ?? walletData.wallet_balance;
  const balance = parseFloat(balanceStr);
  if (Number.isFinite(balance) && balance < Number(totalAmount)) {
    const err = new Error(
      `Insufficient wallet balance to complete this booking. Wallet balance: ${walletData.wallet_currency || "INR"} ${balance}, required: ${totalAmount}.`
    );
    err.status = 402;
    err.code = "INSUFFICIENT_WALLET_BALANCE";
    throw err;
  }
};

// Sends the booking voucher (real flight/passenger/fare details + PDF
// attachment) to the passenger's email. Called directly (awaited) rather
// than via the BullMQ queue/worker: on a serverless platform like Vercel
// there's no long-running process to pick jobs off `emailQueue`, so relying
// on it silently means no email ever goes out. This is deliberately
// fail-soft — a failed email must never fail the booking response, since
// the payment/ticket has already gone through by this point.
const sendBookingConfirmationEmail = async (bookingRecord, recipientEmail) => {
  if (!recipientEmail) {
    console.warn("[Email] No recipient email available, skipping booking confirmation email.");
    return { success: false, error: "No recipient email" };
  }
  try {
    const pdfBuffer = await generateBookingPDF(bookingRecord);
    const passengerNames = (Array.isArray(bookingRecord.passengers) ? bookingRecord.passengers : [])
      .map((p) => `${p.Title || p.title || ""} ${p.FirstName || p.firstName || ""} ${p.LastName || p.lastName || ""}`.trim())
      .filter(Boolean)
      .join(", ") || "Traveler";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color:#FF2D1A; margin-bottom:0;">FlyAnyTrip</h2>
        <p style="color:#666; margin-top:4px;">Booking Confirmation</p>
        <p>Hi ${passengerNames},</p>
        <p>Your flight booking is confirmed. Your PNR is <strong>${bookingRecord.pnr || "-"}</strong>
        (Booking ID: <strong>${bookingRecord.bookingId}</strong>).</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:6px 0; color:#666;">Airline</td><td style="padding:6px 0; text-align:right;">${bookingRecord.airlineName || "-"} ${bookingRecord.flightNumber ? `(${bookingRecord.airlineCode || ""}-${bookingRecord.flightNumber})` : ""}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">Route</td><td style="padding:6px 0; text-align:right;">${bookingRecord.origin || "-"} &rarr; ${bookingRecord.destination || "-"}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">Total Paid</td><td style="padding:6px 0; text-align:right; font-weight:bold;">${bookingRecord.currency || "INR"} ${Number(bookingRecord.totalAmount || 0).toLocaleString("en-IN")}</td></tr>
        </table>
        <p>Your full e-ticket / voucher is attached as a PDF to this email.</p>
        <p style="color:#999; font-size:12px; margin-top:24px;">This is an automated message from FlyAnyTrip.</p>
      </div>
    `;

    const result = await sendBookingVoucherEmail(
      recipientEmail,
      `FlyAnyTrip - Booking Confirmed (PNR: ${bookingRecord.pnr || bookingRecord.bookingId})`,
      `Your booking is confirmed. PNR: ${bookingRecord.pnr || "-"}. Booking ID: ${bookingRecord.bookingId}. Your voucher is attached.`,
      htmlContent,
      pdfBuffer,
      `FlyAnyTrip_Voucher_${bookingRecord.bookingId}.pdf`
    );

    if (result.success) {
      console.log(`[Email] Booking confirmation sent to ${recipientEmail} for booking ${bookingRecord.bookingId}`);
    } else {
      console.error(`[Email] Failed to send booking confirmation for ${bookingRecord.bookingId}:`, result.error);
    }
    return result;
  } catch (err) {
    console.error(`[Email] Error building/sending booking confirmation for ${bookingRecord.bookingId}:`, err);
    return { success: false, error: err.message };
  }
};

// Extracts the actual booking payload (PNR/BookingId/FlightItinerary/etc.)
// from an Adivaha response. Confirmed against a LIVE ticketForLcc response:
// the envelope carrying Error/ResponseStatus/TraceId/order_id
// (responseData.Response) wraps a SECOND "Response" object one level
// deeper — responseData.Response.Response — which is where PNR/BookingId
// actually live. This was being read one level too shallow everywhere,
// which is why genuinely successful bookings were being logged and treated
// as "provider returned no PNR/BookingId" and rejected as failures. Falls
// back to the outer object itself if there's no nested Response, in case a
// different Adivaha endpoint returns it flat instead.
const extractProviderBookingResponse = (data) => {
  const outer = data?.responseData?.Response || data?.responseData || null;
  const inner = (outer?.Response && typeof outer.Response === "object") ? outer.Response : outer;
  return { outer, inner };
};

// LCC Ticket Booking
router.post("/book-lcc", async (req, res, next) => {
  try {
    const { bookingPayload, meta } = req.body;
    // Accept either direct Adivaha payload or wrapped payload with metadata
    const providerPayload = bookingPayload || req.body;

    await assertWalletCanCover(meta?.financials?.totalAmount);

    const data = await bookLCCTicketAPI(providerPayload);

    // Check whether Adivaha actually confirmed the ticket BEFORE touching
    // the database or sending any email. Previously this was skipped
    // server-side (only the client checked it) — so a rejected/expired fare
    // still got written to the DB as "CONFIRMED" with a fabricated PNR
    // ("FLY" + random) and BookingId ("BK" + Date.now()), and a real
    // "Booking Confirmed" voucher email went out for a ticket that was
    // never actually issued.
    const { isError, rawStatus, statusMsg } = getProviderBookingError(data);
    if (isError) {
      console.warn(`[Adivaha][book-lcc] Provider rejected the booking — not saving as confirmed, not emailing a voucher. Status=${rawStatus} Message="${statusMsg}"`);
      // Persist the attempt as FAILED (not CONFIRMED) for support/audit
      // purposes, using a locally-generated reference since Adivaha never
      // issued a real BookingId for a rejected booking.
      const failedBookingId = meta?.bookingId || ("FAILEDBK" + Date.now());
      await saveBookingToDatabase({
        bookingId: failedBookingId,
        traceId: providerPayload.TraceId || meta?.traceId,
        isLCC: true,
        status: "FAILED",
        paymentStatus: "COMPLETED", // Razorpay payment already succeeded at this point
        paymentId: meta?.paymentId,
        flightInfo: meta?.flightInfo,
        financials: meta?.financials,
        passengers: providerPayload.Passengers || meta?.passengers,
        addons: meta?.addons,
        rawResponse: data,
        userEmail: meta?.userEmail || providerPayload.Passengers?.[0]?.Email
      });
      return res.json({ ...data }); // no pnr/bookingId/emailSent — nothing was actually booked
    }

    const { inner: providerResp } = extractProviderBookingResponse(data);
    const pnr = providerResp?.PNR || providerResp?.B2B2CPNR;
    const bookingId = providerResp?.BookingId;

    if (!pnr || !bookingId) {
      // The provider reported success (no Error, ResponseStatus 1) but we
      // still couldn't find a PNR/BookingId at either nesting level. Rather
      // than silently fabricating one and emailing a fake confirmation,
      // treat this as an error — log the FULL raw response (not the
      // console-truncated version) so the actual shape is visible if
      // Adivaha ever changes it again.
      console.error(`[Adivaha][book-lcc] Provider reported success but no PNR/BookingId was found at either nesting level. Full raw response:`, JSON.stringify(data));
      return res.status(502).json({
        success: false,
        message: "Booking provider did not return a valid PNR/BookingId. Please try again or contact support.",
        ...data
      });
    }

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

    // LCC bookings are ticketed immediately in this single call, so the
    // confirmation voucher email goes out right here. Awaited so the
    // response reflects whether the email actually sent (`emailSent`), but
    // a failure here must never fail the booking response — the ticket is
    // already issued and paid for regardless of email delivery.
    let emailSent = false;
    if (dbRecord) {
      const recipientEmail = meta?.userEmail || providerPayload.Passengers?.[0]?.Email;
      const emailResult = await sendBookingConfirmationEmail(dbRecord, recipientEmail);
      emailSent = !!emailResult.success;
    }

    res.json({
      ...data,
      dbBookingId: dbRecord?.id,
      pnr,
      bookingId,
      emailSent
    });
  } catch (error) {
    next(error);
  }
});

// Non-LCC Flight Book (Hold)
// NOTE: This only places a hold — no ticket exists yet, so no confirmation
// email is sent here. The email goes out from /issue-ticket once the ticket
// is actually issued.
router.post("/book-non-lcc", async (req, res, next) => {
  try {
    const { bookingPayload, meta } = req.body;
    const providerPayload = bookingPayload || req.body;

    await assertWalletCanCover(meta?.financials?.totalAmount);

    const data = await bookNonLCCAPI(providerPayload);

    const { isError, rawStatus, statusMsg } = getProviderBookingError(data);
    if (isError) {
      console.warn(`[Adivaha][book-non-lcc] Provider rejected the hold booking. Status=${rawStatus} Message="${statusMsg}"`);
      const failedBookingId = meta?.bookingId || ("FAILEDBK" + Date.now());
      await saveBookingToDatabase({
        bookingId: failedBookingId,
        traceId: providerPayload.TraceId || meta?.traceId,
        isLCC: false,
        status: "FAILED",
        paymentStatus: "COMPLETED",
        paymentId: meta?.paymentId,
        flightInfo: meta?.flightInfo,
        financials: meta?.financials,
        passengers: providerPayload.Passengers || meta?.passengers,
        addons: meta?.addons,
        rawResponse: data,
        userEmail: meta?.userEmail || providerPayload.Passengers?.[0]?.Email
      });
      return res.json({ ...data });
    }

    const { inner: providerResp } = extractProviderBookingResponse(data);
    const pnr = providerResp?.PNR || providerResp?.B2B2CPNR;
    const bookingId = providerResp?.BookingId;

    if (!pnr || !bookingId) {
      console.error(`[Adivaha][book-non-lcc] Provider reported success but no PNR/BookingId was found at either nesting level. Full raw response:`, JSON.stringify(data));
      return res.status(502).json({
        success: false,
        message: "Booking provider did not return a valid PNR/BookingId for the hold. Please try again or contact support.",
        ...data
      });
    }

    // Save initial hold booking to Database — status PENDING, not
    // CONFIRMED: a Non-LCC hold isn't a ticket yet, and previously this was
    // always written as "CONFIRMED" even though ticketing only actually
    // happens in /issue-ticket.
    const dbRecord = await saveBookingToDatabase({
      bookingId,
      pnr,
      traceId: providerPayload.TraceId || meta?.traceId,
      isLCC: false,
      status: "PENDING",
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
// This is the point at which a Non-LCC (Hold) booking actually becomes a
// ticket, so the confirmation voucher email is sent from here, using the
// full booking record (passengers/flight/financials) already stored during
// /book-non-lcc plus the freshly confirmed PNR.
router.post("/issue-ticket", async (req, res, next) => {
  try {
    const data = await issueNonLCCTicketAPI(req.body);

    // Same guard as /book-lcc and /book-non-lcc: don't mark the booking
    // CONFIRMED or send a "Booking Confirmed" email if Adivaha actually
    // reported an error (e.g. a price change on IsPriceChangeAccepted, or
    // the hold expiring before issuance) — previously this route emailed a
    // voucher for *any* response, error or not.
    const { isError, rawStatus, statusMsg } = getProviderBookingError(data);
    if (isError) {
      console.warn(`[Adivaha][issue-ticket] Provider rejected ticket issuance. Status=${rawStatus} Message="${statusMsg}"`);
      if (req.body.BookingId) {
        await prisma.booking.updateMany({
          where: { bookingId: String(req.body.BookingId) },
          data: { status: "FAILED", rawResponse: data }
        }).catch((err) => console.error("[DB Error] Failed to mark booking FAILED:", err));
      }
      return res.json({ ...data, emailSent: false });
    }

    const { inner: providerResp } = extractProviderBookingResponse(data);
    let dbRecord = null;
    if (providerResp && req.body.BookingId) {
      dbRecord = await prisma.booking.update({
        where: { bookingId: String(req.body.BookingId) },
        data: {
          pnr: (providerResp.PNR || req.body.PNR) ? String(providerResp.PNR || req.body.PNR) : undefined,
          status: "CONFIRMED",
          rawResponse: data
        }
      }).catch((err) => {
        console.error("[DB Error] Failed to mark booking CONFIRMED after ticket issue:", err);
        return null;
      });
    }

    let emailSent = false;
    if (dbRecord) {
      const recipientEmail = req.body.email
        || (Array.isArray(dbRecord.passengers) ? dbRecord.passengers.find((p) => p.IsLeadPax || p.isLeadPax)?.Email : null)
        || (Array.isArray(dbRecord.passengers) ? dbRecord.passengers[0]?.Email : null);
      const emailResult = await sendBookingConfirmationEmail(dbRecord, recipientEmail);
      emailSent = !!emailResult.success;
    }

    res.json({ ...data, emailSent });
  } catch (error) {
    next(error);
  }
});

// Resend the booking voucher email on demand — used by the "Email Ticket"
// action on the booking success / dashboard pages instead of that button
// just showing a fake toast with no real request behind it.
router.post("/resend-ticket-email", async (req, res, next) => {
  try {
    const { bookingId, email } = req.body;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId is required" });
    }
    const dbRecord = await prisma.booking.findUnique({ where: { bookingId: String(bookingId) }, include: { user: true } });
    if (!dbRecord) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    const recipientEmail = email
      || dbRecord.user?.email
      || (Array.isArray(dbRecord.passengers) ? dbRecord.passengers.find((p) => p.IsLeadPax || p.isLeadPax)?.Email : null)
      || (Array.isArray(dbRecord.passengers) ? dbRecord.passengers[0]?.Email : null);

    const result = await sendBookingConfirmationEmail(dbRecord, recipientEmail);
    if (!result.success) {
      return res.status(502).json({ success: false, message: result.error || "Failed to send email" });
    }
    res.json({ success: true, sentTo: recipientEmail });
  } catch (error) {
    next(error);
  }
});

// Stream the booking voucher PDF for direct download (e.g. "Download
// Boarding Pass" on the success page).
router.get("/booking-pdf/:bookingId", async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const dbRecord = await prisma.booking.findUnique({ where: { bookingId: String(bookingId) } });
    if (!dbRecord) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    const pdfBuffer = await generateBookingPDF(dbRecord);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="FlyAnyTrip_Voucher_${bookingId}.pdf"`);
    res.send(pdfBuffer);
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

