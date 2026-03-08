import mongoose from "mongoose";
import { docDbConnection } from "../../db.js";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    topic: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    hook: {
      type: String,
      default: "",
    },

    script: {
      type: String,
      default: "",
    },

    hashtags: {
      type: [String],
      default: [],
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    platform: {
      type: String,
      default: "",
    },

    niche: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

const Project =
  docDbConnection.models.Project || docDbConnection.model("Project", projectSchema);

export default Project;
