import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0.01 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

export default mongoose.model("Product", productSchema);
