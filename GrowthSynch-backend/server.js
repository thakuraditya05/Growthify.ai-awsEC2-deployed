import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns";
import app from "./src/app.js";
import cron from "node-cron";
import { MONGO_URI } from "./config.js";
import { runAllCronJobs } from "./src/controllers/cronController.js";

const PORT = process.env.PORT || 5000;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// ── DB Connection & Server Start ──
mongoose.connect(MONGO_URI || process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    // 1. Ek baar server start hote hi data fetch karlo
    try {
      await runAllCronJobs();
    } catch (err) {
      console.error("Initial Cron Run Error:", err);
    }

    // 2. Har 30 minute mein background mein cron job chalega
    cron.schedule("*/30 * * * *", runAllCronJobs);

    // 3. Express API Server Start karo
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Startup error:", error);
    process.exit(1);
  });










