import { generateTextFromAI } from "../../services/aiService.js";
import { generateThumbnailImage } from "../../services/thumbnailService.js";
import Project from "../../models/Project.js";
import { logError } from "../../utils/logger.js";

export const generateThumbnail = async (req, res) => {
  try {
    const {
      projectId,
      createNew,
      title,
      mood,
      colorPreference,
      userDescription,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // ======================================
    // STEP 1 — Prompt Engineering (Titan Text)
    // ======================================

    const promptEngineeringInput = `
You are an expert YouTube thumbnail prompt engineer.

Convert the following structured inputs into a detailed image generation prompt.

Title: ${title}
Mood: ${mood || "Dramatic"}
Color Preference: ${colorPreference || "High contrast"}
Additional Description: ${userDescription || "None"}

Requirements:
- Big bold typography
- Cinematic lighting
- High contrast
- Professional YouTube style
- Visually engaging
- 16:9 aspect ratio
- Ultra detailed

Return ONLY the final image generation prompt.
`;

    const enhancedPrompt = await generateTextFromAI({
      prompt: promptEngineeringInput,
      maxTokens: 300,
      temperature: 0.7,
      topP: 0.9,
    });

    // ======================================
    // STEP 2 — Generate Image (Titan Image → S3)
    // ======================================

    const { thumbnailUrl: imageUrl, promptUsed } = await generateThumbnailImage(
      enhancedPrompt,
      {
        title,
        mood,
        colorPreference,
        userDescription,
      },
    );

    // ======================================
    // STEP 3 — Project Handling Logic
    // ======================================

    let targetProject = null;

    // Case 1 — Update existing project
    if (projectId) {
      targetProject = await Project.findOne({
        _id: projectId,
        user: req.user._id,
      });

      if (!targetProject) {
        return res.status(404).json({ message: "Project not found" });
      }
    }

    // Case 2 — Create new project
    else if (createNew === true) {
      targetProject = await Project.create({
        user: req.user._id,
        status: "draft",
      });
    }

    // Save thumbnail to project
    if (targetProject) {
      targetProject.thumbnailUrl = imageUrl;
      targetProject.title = title;
      targetProject.status = "in-progress";

      await targetProject.save();

      return res.json(targetProject);
    }

    // Case 3 — Just return thumbnail
    return res.json({
      thumbnailUrl: imageUrl,
      promptUsed,
    });
  } catch (error) {
    logError("Thumbnail generation failed", error, {
      userId: req.user?._id?.toString?.(),
      route: req.originalUrl,
      method: req.method,
      payload: {
        projectId: req.body?.projectId || null,
        title: req.body?.title || "",
      },
    });

    const status =
      Number.isInteger(error?.statusCode) && error.statusCode >= 400
        ? error.statusCode
        : 500;

    res.status(status).json({
      message: error?.message || "Thumbnail generation failed",
      details: error?.details,
    });
  }
};
