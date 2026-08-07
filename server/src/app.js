import express from "express";
import cors from "cors";
import flightRoutes from "./routes/flights.js";

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use("/api/flights", flightRoutes);

// Fallback Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
