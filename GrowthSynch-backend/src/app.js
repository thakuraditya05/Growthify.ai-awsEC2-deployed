import express from "express";
import cors from "cors";

// ─── IMPORTING ROUTES (ES Module format) ───
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Converted from require to import (added .js extension for ES modules)
import trendingRoutes from "./routes/trendingRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ─── MIDDLEWARES ───
app.use(cors()); // Frontend ko connect karne ke liye
app.use(express.json());

// ─── ROUTES ───
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);


// New route for trending data  
app.use("/api/v1/trending", trendingRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("GrowthSync API Running 🚀");
});

// ─── GLOBAL ERROR HANDLER ───
// Isko hamesha saare routes ke neeche rakhna zaroori hai
app.use(errorHandler);

export default app;


// import express from "express";
// import cors from "cors";

// const app = express();

// app.use(cors());
// app.use(express.json());

// import authRoutes from "./routes/authRoutes.js";
// app.use("/api/auth", authRoutes);

// import userRoutes from "./routes/userRoutes.js";
// app.use("/api/user", userRoutes);

// import projectRoutes from "./routes/projectRoutes.js";
// app.use("/api/projects", projectRoutes);

// import dashboardRoutes from "./routes/dashboardRoutes.js";
// app.use("/api/dashboard", dashboardRoutes);

// import aiRoutes from "./routes/aiRoutes.js";
// app.use("/api/ai", aiRoutes);

// app.get("/", (req, res) => {
//   res.send("GrowthSync API Running 🚀");
// });

// export default app;


// mrinal-code  


// const express = require("express");
// const cors = require("cors");
// const trendingRoutes = require("./routes/trendingRoutes");
// const errorHandler = require("./middlewares/errorHandler");

// const app = express();

// // Middlewares
// app.use(cors()); // Frontend ko connect karne ke liye
// app.use(express.json());

// // Routes
// app.use("/api/v1/trending", trendingRoutes);

// // Global Error Handler
// app.use(errorHandler);

// module.exports = app;