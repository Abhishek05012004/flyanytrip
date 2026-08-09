import 'dotenv/config';
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// Only listen if not running as a Vercel Serverless Function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;