import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, unique: true },
    shopName: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    balance: { type: Number, default: 0 },
    logoUrl: { type: String },
    stripeAccountId: { type: String },
  },
  {
    timestamps: true,
    collection: "shops",
  },
);

export default mongoose.model("Shop", shopSchema);
