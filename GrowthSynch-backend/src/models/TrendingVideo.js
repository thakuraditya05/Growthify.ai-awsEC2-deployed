import mongoose from "mongoose";
import { atlasConnection } from "../../db.js";

const trendingVideoSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 3,
  },

  videoId: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  publishedAt: {
    type: Date,
    required: true,
  },

  categoryId: {
    type: String,
    default: "",
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
});

const TrendingVideo =
  atlasConnection.models.TrendingVideo ||
  atlasConnection.model("TrendingVideo", trendingVideoSchema);

export default TrendingVideo;
