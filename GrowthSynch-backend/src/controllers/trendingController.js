import TrendingVideo from "../models/TrendingVideo.js";
import TrendingReddit from "../models/TrendingReddit.js";
import TrendingX from "../models/TrendingX.js";
import TrendingMusic from "../models/TrendingMusic.js";

// API to get all trends for the frontend Trends.jsx page
export const getAllTrends = async (req, res, next) => {
  try {
    const youtubeTrends = await TrendingVideo.find().sort({ timestamp: -1 }).limit(10);
    const redditTrends = await TrendingReddit.find().sort({ score: -1 }).limit(10);
    const XTrends = await TrendingX.find().sort({ score: -1 }).limit(10);
    const musicTrends = await TrendingMusic.find().sort({ score: -1 }).limit(10);
    
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