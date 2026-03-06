import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app.js";
import cron from "node-cron";
import { MONGO_URI } from "./config.js";
import { runAllCronJobs } from "./src/controllers/cronController.js";

const PORT = process.env.PORT || 5000;

// ── DB Connection & Server Start ──
mongoose.connect(MONGO_URI || process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    
    // Log HF Key (Aapne pehle block mein rakha tha)
    console.log("Using HF Key:", process.env.HUGGINFACE_API_TOKEN);

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












// import "dotenv/config";
// import mongoose from "mongoose";
// import app from "./src/app.js";
// const cron = require("node-cron");
// const { MONGO_URI } = require("./config");
// const { runAllCronJobs } = require("./src/controllers/cronController");




// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     app.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT}`);
//       console.log("Using HF Key:", process.env.HUGGINFACE_API_TOKEN);
//     });
//   })
//   .catch((err) => {
//     console.error("DB Connection Error:", err);
//   });





// const PORT = process.env.PORT || 5000;

// mongoose.connect(MONGO_URI)
//   .then(async () => {
//     console.log("✅ MongoDB Connected");

//     // 1. Ek baar server start hote hi data fetch karlo
//     await runAllCronJobs();

//     // 2. Har 30 minute mein background mein cron job chalega
//     cron.schedule("*/30 * * * *", runAllCronJobs);

//     // 3. Express API Server Start karo
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("❌ Startup error:", error);
//     process.exit(1);
//   });


// backend/
//  ├── config.js
//  ├── server.js
//  └── src/
//       ├── app.js
//       ├── controllers/
//       │    ├── cronController.js     <-- (Tumhara data fetch + save karne wala logic)
//       │    └── trendingController.js <-- (Frontend ko data bhejne wali APIs)
//       ├── middlewares/
//       │    └── errorHandler.js       <-- (Error handle karne ke liye)
//       ├── models/
//       │    ├── TrendingMusic.js
//       │    ├── TrendingReddit.js
//       │    ├── TrendingVideo.js
//       │    └── TrendingX.js
//       ├── routes/
//       │    └── trendingRoutes.js     <-- (Frontend ke liye API endpoints)
//       └── services/
//            ├── redditService.js
//            ├── xService.js
//            └── youtubeService.js