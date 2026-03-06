import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  generateContent,
  refineContent,
  saveContentToProject,
} from "../controllers/AI logic/contentGenerator.js";
import { generateThumbnail } from "../controllers/AI logic/thumbnailGenerator.js";

const router = express.Router();

router.post("/generate-content", authMiddleware, generateContent);
router.post("/refine-content", authMiddleware, refineContent);
router.post("/save-content", authMiddleware, saveContentToProject);

router.post("/generate-thumbnail", authMiddleware, generateThumbnail);



export default router;
