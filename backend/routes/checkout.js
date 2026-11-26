import express from "express";
import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import Order from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// POST /api/checkout: Process customer cart and generate order
router.post("/", requireAuth, requireRole(["customer"]), async (req, res, next) => {
  try {
    const customerId = req.user.id;
    let inputItems = req.body?.items;

    // If items are not in body, load from active user cart
    if (!Array.isArray(inputItems) || inputItems.length === 0) {
      const cart = await Cart.findOne({ userId: customerId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Your cart is empty" });
      }
      inputItems = cart.items.map((item) => ({
        productId: item.productId.toString(),
        quantity: item.quantity,
      }));
    }

    if (inputItems.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided for checkout" });
    }

    // 1. Verify all products, active vendor shops, and stock availability
    const orderItems = [];
    let totalAmount = 0;
    const vendorSums = {};

    for (const item of inputItems) {
      const quantity = parseInt(item.quantity, 10);
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid quantity specified" });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      if (product.stock < quantity) {
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}, requested: ${quantity}`,
        });
      }

      const itemTotal = product.price * quantity;
      totalAmount += itemTotal;

      vendorSums[product.vendorId] = (vendorSums[product.vendorId] || 0) + itemTotal;

      orderItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        quantity,
        priceAtPurchase: product.price,
        fulfillmentStatus: "Processing",
      });
    }

    // 2. Atomically decrement stock for all items
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        return res.status(409).json({
          success: false,
          message: "Stock changed during processing. Please review your cart and retry.",
        });
      }
    }

    // 3. Create the master Order record
    const order = await Order.create({
      customerId,
      items: orderItems,
      totalAmount,
      paymentStatus: "paid",
    });

    // 4. Update vendor balances with 90% revenue share
    for (const [vendorId, subtotal] of Object.entries(vendorSums)) {
      const vendorShare = subtotal * 0.9;
      await Shop.findOneAndUpdate(
        { vendorId },
        { $inc: { balance: vendorShare } }
      );
    }

    // 5. Clear customer's active cart
    await Cart.findOneAndUpdate({ userId: customerId }, { $set: { items: [] } });

    res.status(201).json({
      success: true,
      message: "Order placed and paid successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        itemCount: order.items.length,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
