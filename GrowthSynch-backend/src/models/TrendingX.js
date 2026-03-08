import mongoose from "mongoose";
import { atlasConnection } from "../../db.js";

const trendingXSchema = new mongoose.Schema(
  {
    hashtag: {
      type: String,
      unique: true,
    },
    count: Number,
  },
  { timestamps: true },
);

const TrendingX =
  atlasConnection.models.TrendingX || atlasConnection.model("TrendingX", trendingXSchema);

export default TrendingX;
