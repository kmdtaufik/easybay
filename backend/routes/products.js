import express from "express";
import Product from "../models/Product.js";
import { auth } from "../auth.js";

const router = express.Router();

// Middleware to check authentication and attach session to req
const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.session = session;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware to check if user is a vendor
const requireVendor = (req, res, next) => {
  if (req.session?.user?.role !== "vendor") {
    return res.status(403).json({ error: "Forbidden: Vendor access required" });
  }
  next();
};

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("GET /products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET products for a specific vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("GET /products/vendor error:", error);
    res.status(500).json({ error: "Failed to fetch vendor products" });
  }
});

// GET a single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("GET /products/:id error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST a new product (Vendor only)
router.post("/", requireAuth, requireVendor, async (req, res) => {
  try {
    const { title, description, price, stock, category, images } = req.body;
    
    // Validate required fields
    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProduct = new Product({
      vendorId: req.session.user.id,
      title,
      description,
      price,
      stock,
      category,
      images: images || [],
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("POST /products error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT update a product (Vendor owner only)
router.put("/:id", requireAuth, requireVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.vendorId !== req.session.user.id) {
      return res.status(403).json({ error: "Forbidden: You do not own this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedProduct);
  } catch (error) {
    console.error("PUT /products/:id error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE a product (Vendor owner only)
router.delete("/:id", requireAuth, requireVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.vendorId !== req.session.user.id) {
      return res.status(403).json({ error: "Forbidden: You do not own this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE /products/:id error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
