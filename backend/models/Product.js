import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    images: [{ type: String }],
  },
  {
    timestamps: true,
    collection: "products",
  },
);

export default mongoose.model("Product", productSchema);
