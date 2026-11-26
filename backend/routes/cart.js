import express from "express";
import { Cart } from "../models/Cart.js";
import Product from "../models/Product.js";
import { requireAuth, requireCustomer } from "../middleware/auth.js";

const router = express.Router();

const isValidQuantity = (q) => Number.isInteger(q) && q >= 1;

// GET current user's cart
router.get("/", requireAuth, requireCustomer, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// POST add item to cart
// Reject cart additions if stock is 0
router.post("/", requireAuth, requireCustomer, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    if (!isValidQuantity(quantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: "Product is out of stock" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock})`,
        });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity exceeds available stock (${product.stock})`,
        });
      }
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const populatedCart = await cart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    next(error);
  }
});

// PUT update item quantity
router.put("/:productId", requireAuth, requireCustomer, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!isValidQuantity(quantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock})`,
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await cart.populate("items.productId");
      return res.json(populatedCart);
    } else {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE remove item from cart
router.delete("/:productId", requireAuth, requireCustomer, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    const populatedCart = await cart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    next(error);
  }
});

// DELETE clear entire cart
router.delete("/", requireAuth, requireCustomer, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
});

export default router;
