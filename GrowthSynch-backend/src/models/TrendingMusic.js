import mongoose from "mongoose";
import { atlasConnection } from "../../db.js";

const trendingMusicSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 3,
    },

    videoId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: false },
);

const TrendingMusic =
  atlasConnection.models.TrendingMusic ||
  atlasConnection.model("TrendingMusic", trendingMusicSchema);

export default TrendingMusic;
