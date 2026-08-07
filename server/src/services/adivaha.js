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

