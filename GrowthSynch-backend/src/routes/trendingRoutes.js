import express from "express";
import { getAllTrends, saveTrend, getSavedTrends, deleteSavedTrend } from "../controllers/trendingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Jab frontend GET /api/v1/trending call karega, tab ye chalega
router.get("/", getAllTrends);

// Save a trend
router.post("/save", authMiddleware, saveTrend);

// Get saved trends for logged-in user
router.get("/saved", authMiddleware, getSavedTrends);

// Delete a saved trend
router.post("/delete-save", authMiddleware, deleteSavedTrend);

export default router;