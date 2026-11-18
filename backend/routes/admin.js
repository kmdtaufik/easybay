import express from "express";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// All routes here require Admin role
router.use(requireAuth, requireRole(["admin"]));

// GET /api/admin/shops: List all shops
router.get("/shops", async (req, res, next) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json(shops);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/shops/:id/status: Approve or suspend a vendor's shop
router.patch("/shops/:id/status", async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be a boolean" });
    }

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive } },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    res.json({
      success: true,
      message: `Shop ${isActive ? "activated/approved" : "suspended"} successfully`,
      shop,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/stats: Platform overview
router.get("/stats", async (req, res, next) => {
  try {
    const [totalShops, activeShops, totalProducts, totalOrders] = await Promise.all([
      Shop.countDocuments(),
      Shop.countDocuments({ isActive: true }),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    res.json({
      totalShops,
      activeShops,
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
