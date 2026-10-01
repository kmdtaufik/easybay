import express from "express";
import { Cart } from "../models/Cart.js";
import { requireAuth, requireCustomer } from "../middleware/auth.js";

const router = express.Router();

// GET current user's cart
router.get("/", requireAuth, requireCustomer, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.session.user.id }).populate("items.productId");
    
    if (!cart) {
      cart = await Cart.create({ userId: req.session.user.id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    console.error("GET /cart error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST add item to cart
router.post("/", requireAuth, requireCustomer, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    let cart = await Cart.findOne({ userId: req.session.user.id });
    
    if (!cart) {
      cart = new Cart({ userId: req.session.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // If product exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    
    // Return populated cart
    const populatedCart = await cart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    console.error("POST /cart error:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// PUT update item quantity
router.put("/:productId", requireAuth, requireCustomer, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ error: "Valid quantity is required" });
    }

    const cart = await Cart.findOne({ userId: req.session.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await cart.populate("items.productId");
      return res.json(populatedCart);
    } else {
      return res.status(404).json({ error: "Item not found in cart" });
    }
  } catch (error) {
    console.error("PUT /cart/:productId error:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE remove item from cart
router.delete("/:productId", requireAuth, requireCustomer, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.session.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    
    const populatedCart = await cart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    console.error("DELETE /cart/:productId error:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// DELETE clear entire cart
router.delete("/", requireAuth, requireCustomer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error("DELETE /cart error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router;
