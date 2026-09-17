import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, alias: "id" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },

    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    collection: "user",
    timestamps: false,
  },
);

export default mongoose.model("User", userSchema);
