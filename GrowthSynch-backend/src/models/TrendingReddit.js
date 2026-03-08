import mongoose from "mongoose";
import { atlasConnection } from "../../db.js";

const trendingRedditSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 3,
  },

  postId: {
    type: String,
    required: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  subreddit: {
    type: String,
    default: "",
  },

  score: {
    type: Number,
    default: 0,
  },

  numComments: {
    type: Number,
    default: 0,
  },

  url: {
    type: String,
    default: "",
  },
});

const TrendingReddit =
  atlasConnection.models.TrendingReddit ||
  atlasConnection.model("TrendingReddit", trendingRedditSchema);

export default TrendingReddit;
