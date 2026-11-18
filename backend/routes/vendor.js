import express from "express";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ensureShop } from "../utils/shop.js";

const router = express.Router();

// Guard all vendor routes
router.use(requireAuth, requireRole(["vendor"]));

// GET /api/vendor/stats: Real-time statistics for the Vendor Dashboard
router.get("/stats", async (req, res, next) => {
  try {
    const vendorId = req.user.id;
    const shop = await ensureShop(vendorId, req.user.name);

    // Run metrics in parallel
    const [totalProducts, orders] = await Promise.all([
      Product.countDocuments({ vendorId }),
      Order.find({ "items.vendorId": vendorId })
        .populate("items.productId")
        .sort({ createdAt: -1 }),
    ]);

    let awaitingFulfillment = 0;
    let calculatedRevenue = 0;

    const formattedRecentOrders = orders.slice(0, 5).map((order) => {
      const vendorItems = order.items.filter((item) => item.vendorId === vendorId);
      const vendorSubtotal = vendorItems.reduce(
        (acc, item) => acc + (item.priceAtPurchase || 0) * (item.quantity || 1),
        0
      );

      // Check items awaiting fulfillment
      vendorItems.forEach((item) => {
        if (["Pending", "Processing"].includes(item.fulfillmentStatus)) {
          awaitingFulfillment++;
        }
      });

      if (order.paymentStatus === "paid") {
        // 90% vendor payout per SRS 3.5
        calculatedRevenue += vendorSubtotal * 0.9;
      }

      return {
        _id: order._id,
        createdAt: order.createdAt,
        paymentStatus: order.paymentStatus,
        customerName: order.customerId,
        itemCount: vendorItems.length,
        itemsSummary: vendorItems
          .map((i) => i.productId?.title || "Item")
          .join(", "),
        fulfillmentStatus: vendorItems[0]?.fulfillmentStatus || "Processing",
        vendorSubtotal,
      };
    });

    res.json({
      shop: {
        _id: shop._id,
        shopName: shop.shopName,
        description: shop.description,
        isActive: shop.isActive,
        balance: shop.balance,
        logoUrl: shop.logoUrl,
      },
      balance: shop.balance,
      totalRevenue: calculatedRevenue > 0 ? calculatedRevenue : shop.balance,
      totalOrders: orders.length,
      awaitingFulfillment,
      totalProducts,
      recentOrders: formattedRecentOrders,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/vendor/profile: Get current vendor's shop settings
router.get("/profile", async (req, res, next) => {
  try {
    const shop = await ensureShop(req.user.id, req.user.name);
    res.json(shop);
  } catch (error) {
    next(error);
  }
});

// PUT /api/vendor/profile: Update shop details (name, description, logo)
router.put("/profile", async (req, res, next) => {
  try {
    const { shopName, description, logoUrl } = req.body;
    const updates = {};

    if (shopName !== undefined) {
      if (typeof shopName !== "string" || !shopName.trim()) {
        return res.status(400).json({ success: false, message: "Shop name cannot be empty" });
      }
      updates.shopName = shopName.trim();
    }

    if (description !== undefined) {
      updates.description = typeof description === "string" ? description.trim() : "";
    }

    if (logoUrl !== undefined) {
      updates.logoUrl = typeof logoUrl === "string" ? logoUrl.trim() : "";
    }

    const shop = await Shop.findOneAndUpdate(
      { vendorId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    res.json({ success: true, message: "Shop profile updated", shop });
  } catch (error) {
    next(error);
  }
});

// POST /api/vendor/payout: Request payout of available balance
router.post("/payout", async (req, res, next) => {
  try {
    const { amount, payoutMethod = "Stripe Connect" } = req.body;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: "Valid positive payout amount is required" });
    }

    const shop = await Shop.findOne({ vendorId: req.user.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    if (shop.balance < numAmount) {
      return res.status(400).json({
        success: false,
        message: `Requested payout ($${numAmount.toFixed(2)}) exceeds available balance ($${shop.balance.toFixed(2)})`,
      });
    }

    // Atomic deduction to prevent double-spending
    const updatedShop = await Shop.findOneAndUpdate(
      { vendorId: req.user.id, balance: { $gte: numAmount } },
      { $inc: { balance: -numAmount } },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(409).json({ success: false, message: "Balance changed during processing, please retry" });
    }

    res.json({
      success: true,
      message: `Payout of $${numAmount.toFixed(2)} via ${payoutMethod} requested successfully`,
      newBalance: updatedShop.balance,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
