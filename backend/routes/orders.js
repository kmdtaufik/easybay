import express from "express";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

const VALID_FULFILLMENT_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// GET /api/orders: Role-dependent
// Customers receive their own orders; Vendors receive orders containing their items; Admins receive all.
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { role, id: userId } = req.user;
    let query = {};

    if (role === "customer") {
      query = { customerId: userId };
    } else if (role === "vendor") {
      // Find orders that contain at least one item sold by this vendor
      query = { "items.vendorId": userId };
    } else if (role === "admin") {
      query = {};
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized role" });
    }

    const orders = await Order.find(query)
      .populate("items.productId")
      .sort({ createdAt: -1 });

    // For vendors, decorate each order with vendor-specific calculations
    if (role === "vendor") {
      const vendorOrders = orders.map((order) => {
        const orderObj = order.toObject();
        // Filter items or flag which items belong to this vendor
        orderObj.vendorItems = orderObj.items.filter((item) => item.vendorId === userId);
        orderObj.vendorSubtotal = orderObj.vendorItems.reduce(
          (sum, item) => sum + (item.priceAtPurchase || 0) * (item.quantity || 1),
          0
        );
        return orderObj;
      });
      return res.json(vendorOrders);
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id: Get single order details
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const { role, id: userId } = req.user;

    if (role === "customer" && order.customerId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    if (role === "vendor") {
      const hasVendorItem = order.items.some((item) => item.vendorId === userId);
      if (!hasVendorItem) {
        return res.status(403).json({ success: false, message: "Forbidden: No items belonging to you" });
      }
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:id/status: Vendor only
// Updates the fulfillment state for the vendor's specific items within the order.
router.patch("/:id/status", requireAuth, requireRole(["vendor"]), async (req, res, next) => {
  try {
    const { status, itemId } = req.body;
    const vendorId = req.user.id;

    if (!status || !VALID_FULFILLMENT_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_FULFILLMENT_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    let itemUpdated = false;

    // Only update items that belong to this authenticated vendor
    for (const item of order.items) {
      if (item.vendorId === vendorId) {
        if (!itemId || item._id.toString() === itemId) {
          item.fulfillmentStatus = status;
          itemUpdated = true;
        }
      }
    }

    if (!itemUpdated) {
      return res.status(403).json({
        success: false,
        message: "No matching items for this vendor found in order",
      });
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id).populate("items.productId");
    const orderObj = populatedOrder.toObject();
    orderObj.vendorItems = orderObj.items.filter((item) => item.vendorId === vendorId);
    orderObj.vendorSubtotal = orderObj.vendorItems.reduce(
      (sum, item) => sum + (item.priceAtPurchase || 0) * (item.quantity || 1),
      0
    );

    res.json({
      success: true,
      message: `Fulfillment status updated to ${status}`,
      order: orderObj,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
