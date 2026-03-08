import mongoose from "mongoose";
import { docDbConnection } from "../../db.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const User = docDbConnection.models.User || docDbConnection.model("User", userSchema);

export default User;
