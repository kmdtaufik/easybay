import express from "express";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ensureShop } from "../utils/shop.js";

const router = express.Router();

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

// Validates product fields. With `partial`, only provided fields are checked.
// Returns { error } or { data } containing only whitelisted, cleaned fields.
const validateProductFields = (body, { partial = false } = {}) => {
  const data = {};
  const has = (key) => body[key] !== undefined;

  if (!partial || has("title")) {
    if (!isNonEmptyString(body.title)) return { error: "Title is required and must be a non-empty string" };
    data.title = body.title.trim();
  }
  if (!partial || has("description")) {
    if (!isNonEmptyString(body.description)) return { error: "Description is required" };
    data.description = body.description.trim();
  }
  if (!partial || has("price")) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price <= 0) {
      return { error: "Price must be a number greater than 0" };
    }
    data.price = body.price;
  }
  if (!partial || has("stock")) {
    if (typeof body.stock !== "number" || !Number.isInteger(body.stock) || body.stock < 0) {
      return { error: "Stock must be a non-negative integer" };
    }
    data.stock = body.stock;
  }
  if (!partial || has("category")) {
    if (!isNonEmptyString(body.category)) return { error: "Category is required" };
    data.category = body.category.trim();
  }
  if (has("images")) {
    if (!Array.isArray(body.images) || !body.images.every((i) => typeof i === "string")) {
      return { error: "Images must be an array of strings" };
    }
    data.images = body.images;
  } else if (!partial) {
    data.images = [];
  }

  return { data };
};

// GET /api/products: Public. Accepts query parameters (page, limit, category, vendorId).
// Filters out products from inactive or suspended shops.
router.get("/", async (req, res, next) => {
  try {
    const { category, vendorId } = req.query;

    // Query params must be plain strings (blocks operator injection like ?category[$ne]=x)
    if (category !== undefined && typeof category !== "string") {
      return res.status(400).json({ success: false, message: "category must be a string" });
    }
    if (vendorId !== undefined && typeof vendorId !== "string") {
      return res.status(400).json({ success: false, message: "vendorId must be a string" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Exclude explicitly suspended shops. Using $nin (rather than $in of active shops)
    // keeps legacy shops without an `isActive` field visible and the list small.
    const suspendedShops = await Shop.find({ isActive: false }).select("vendorId");
    const suspendedVendorIds = suspendedShops.map((s) => s.vendorId);

    const filter = { vendorId: { $nin: suspendedVendorIds } };

    if (category) {
      filter.category = category;
    }

    if (vendorId) {
      if (suspendedVendorIds.includes(vendorId)) {
        res.set({ "X-Total-Count": "0", "X-Page": page.toString(), "X-Limit": limit.toString() });
        return res.json([]);
      }
      filter.vendorId = vendorId;
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.set("X-Total-Count", total.toString());
    res.set("X-Page", page.toString());
    res.set("X-Limit", limit.toString());
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/vendor/:vendorId: Specific vendor's products
router.get("/vendor/:vendorId", async (req, res, next) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id: Single product
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products: Vendor only.
// Pre-condition: Vendor role and shop.isActive === true.
router.post("/", requireAuth, requireRole(["vendor"]), async (req, res, next) => {
  try {
    const vendorId = req.user.id;

    // Self-heal vendors who onboarded before shops were auto-created, then verify active
    const shop = await ensureShop(vendorId, req.user.name);
    if (shop.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your shop is currently pending admin approval or suspended",
      });
    }

    const { error, data } = validateProductFields(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const savedProduct = await new Product({ ...data, vendorId }).save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id: Vendor owner only
router.put("/:id", requireAuth, requireRole(["vendor"]), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.vendorId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this product" });
    }

    // Whitelisted fields only: vendorId, ratings, timestamps etc. can't be overwritten
    const { error, data } = validateProductFields(req.body, { partial: true });
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id: Vendor owner or Admin only
router.delete("/:id", requireAuth, requireRole(["vendor", "admin"]), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Admins can delete any product; vendors can only delete their own
    if (req.user.role !== "admin" && product.vendorId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
