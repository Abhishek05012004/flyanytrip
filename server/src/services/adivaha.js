import axios from "axios";

const ADIVAHA_API_KEY = process.env.ADIVAHA_API_KEY;
const ADIVAHA_PID = process.env.ADIVAHA_PID;
// Verify default to api.adivaha.io
const ADIVAHA_BASE_URL = process.env.ADIVAHA_BASE_URL || "https://api.adivaha.io";

const adivahaClient = axios.create({
  baseURL: ADIVAHA_BASE_URL,
  headers: {
    "PID": ADIVAHA_PID,
    "x-api-key": ADIVAHA_API_KEY,
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
    "Connection": "close"
  }
});

// Helper function to execute requests with retries for network-level drops
const executeRequest = async (requestFn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      const isNetworkError = 
        error.code === "ECONNRESET" || 
        error.code === "ETIMEDOUT" || 
        error.message?.includes("ECONNRESET");
        
      if (isNetworkError && i < retries - 1) {
        console.warn(`Adivaha connection dropped (${error.code || error.message}). Retrying request in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

export const getFlightLocationsAPI = async (term, limit = 10) => {
  try {
    const response = await executeRequest(() => adivahaClient.get("/flights/api/", {
      params: {
        action: "flightLocations",
        limit,
        term
      }
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Flight Locations Error:", error.response?.data || error.message);
    throw new Error("Failed to search flight locations");
  }
};

export const searchFlightsAPI = async (searchParams) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=flightSearch", {
      action: "flightSearch",
      ...searchParams
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Flight Search Error:", error.response?.data || error.message);
    throw new Error("Failed to search flights from provider");
  }
};

export const searchHotelsAPI = async (searchParams) => {
  try {
    const response = await executeRequest(() => adivahaClient.get("/hotels/search", { params: searchParams }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Hotel Search Error:", error);
    throw new Error("Failed to search hotels from provider");
  }
};

export const getCalendarFareAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=GetCalendarFare", {
      action: "GetCalendarFare",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Calendar Fare Error:", error.response?.data || error.message);
    throw new Error("Failed to get calendar fares from provider");
  }
};

export const updateCalendarFareOfDayAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=UpdateCalendarFareOfDay", {
      action: "UpdateCalendarFareOfDay",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Update Calendar Fare Of Day Error:", error.response?.data || error.message);
    throw new Error("Failed to update calendar fare of the day from provider");
  }
};

export const getFareQuoteAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=FlightFareQuote", {
      action: "FlightFareQuote",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Flight Fare Quote Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch flight fare quote from provider");
  }
};

export const getFareRulesAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=FlightsFareRule", {
      action: "FlightsFareRule",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Flight Fare Rules Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch flight fare rules from provider");
  }
};

export const getSSRAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=FlightSSR", {
      action: "FlightSSR",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Flight SSR Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch flight SSR options from provider");
  }
};

export const bookLCCTicketAPI = async (bookingData) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=LCCFlightTicket", {
      action: "LCCFlightTicket",
      ...bookingData
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha LCC Flight Ticket Error:", error.response?.data || error.message);
    throw new Error("Failed to process LCC flight ticket booking");
  }
};

export const bookNonLCCAPI = async (bookingData) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=NonLCCFlightBook", {
      action: "NonLCCFlightBook",
      ...bookingData
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Non LCC Flight Book Error:", error.response?.data || error.message);
    throw new Error("Failed to process Non-LCC hold booking");
  }
};

export const issueNonLCCTicketAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=NonLCCTicketIssue", {
      action: "NonLCCTicketIssue",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Non LCC Ticket Issue Error:", error.response?.data || error.message);
    throw new Error("Failed to issue Non-LCC flight ticket");
  }
};

export const releaseHoldBookingAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=ReleaseOrCancelHoldBooking", {
      action: "ReleaseOrCancelHoldBooking",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Release Hold Booking Error:", error.response?.data || error.message);
    throw new Error("Failed to release or cancel hold booking");
  }
};

export const getBookingDetailsAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=GetBookingDetails", {
      action: "GetBookingDetails",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Get Booking Details Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch booking details from provider");
  }
};

export const getCancellationChargesAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=GetCancellationCharges", {
      action: "GetCancellationCharges",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Cancellation Charges Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch cancellation charges from provider");
  }
};

export const cancelBookingAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=CancelBooking", {
      action: "CancelBooking",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Cancel Booking Error:", error.response?.data || error.message);
    throw new Error("Failed to submit cancellation request to provider");
  }
};

export const getCancellationStatusAPI = async (params) => {
  try {
    const response = await executeRequest(() => adivahaClient.post("/flights/api/?action=GetCancellationStatus", {
      action: "GetCancellationStatus",
      ...params
    }));
    return response.data;
  } catch (error) {
    console.error("Adivaha Cancellation Status Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch cancellation status from provider");
  }
};


