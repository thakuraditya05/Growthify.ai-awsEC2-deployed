import TrendingVideo from "../models/TrendingVideo.js";
import TrendingReddit from "../models/TrendingReddit.js";
import TrendingX from "../models/TrendingX.js";
import TrendingMusic from "../models/TrendingMusic.js";
import SavedTrend from "../models/SavedTrend.js";

// API to get all trends for the frontend Trends.jsx page
export const getAllTrends = async (req, res, next) => {
  try {
    const youtubeTrends = await TrendingVideo.find().sort({ timestamp: -1 }).limit(50);
    const redditTrends = await TrendingReddit.find().sort({ score: -1 }).limit(50);
    const XTrends = await TrendingX.find().sort({ score: -1 }).limit(50);
    const musicTrends = await TrendingMusic.find().sort({ score: -1 }).limit(50);
    
    res.status(200).json({
      success: true,
      data: {
        youtube: youtubeTrends,
        reddit: redditTrends,
        x: XTrends,
        youtube_music: musicTrends,
      }
    });
  } catch (error) {
    next(error);
  }
};

// Save a trend
export const saveTrend = async (req, res, next) => {
  try {
    const { platform, trendId, title, views, likes, comments, description } = req.body;
    const userId = req.user._id;

    console.log("=== SAVE TREND REQUEST ===");
    console.log("UserId:", userId);
    console.log("Platform:", platform);
    console.log("TrendId:", trendId);
    console.log("Title:", title);
    console.log("Body:", req.body);

    if (!platform || !trendId || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: platform, trendId, title"
      });
    }

    const savedTrend = new SavedTrend({
      userId,
      platform,
      trendId,
      title,
      views: views || 0,
      likes: likes || 0,
      comments: comments || 0,
      description: description || ""
    });

    const result = await savedTrend.save();
    console.log("✅ Trend saved successfully:", result);

    res.status(201).json({
      success: true,
      message: "Trend saved successfully",
      data: result
    });
  } catch (error) {
    console.error("❌ Error saving trend:", error.message);
    console.error("Error details:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This trend is already saved"
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Error saving trend"
    });
  }
};

// Get saved trends for user
export const getSavedTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const savedTrends = await SavedTrend.find({ userId }).sort({ savedAt: -1 });

    res.status(200).json({
      success: true,
      data: savedTrends
    });
  } catch (error) {
    next(error);
  }
};

// Delete a saved trend
export const deleteSavedTrend = async (req, res, next) => {
  try {
    const { trendId, platform } = req.body;
    const userId = req.user._id;

    const result = await SavedTrend.deleteOne({
      userId,
      trendId,
      platform
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Saved trend not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Trend deleted from saves successfully"
    });
  } catch (error) {
    next(error);
  }
};