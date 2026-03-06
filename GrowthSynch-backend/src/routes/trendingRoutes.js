import express from "express";
import { getAllTrends } from "../controllers/trendingController.js";

const router = express.Router();

// Jab frontend GET /api/v1/trending call karega, tab ye chalega
router.get("/", getAllTrends);

export default router;