import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth, db } from "./auth.js";
import mongoose from "mongoose";

import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import adminRoutes from "./routes/admin.js";
import orderRoutes from "./routes/orders.js";
import vendorRoutes from "./routes/vendor.js";
import checkoutRoutes from "./routes/checkout.js";
import { ensureShop, backfillShops } from "./utils/shop.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["X-Total-Count", "X-Page", "X-Limit"],
  }),
);

app.use(express.json());

// Mount routers
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);

// User onboarding: assigns user role and initializes vendor shop
app.post("/api/onboarding", async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { role } = req.body;
    if (role !== "vendor" && role !== "customer" && role !== "admin") {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    let result = await db
      .collection("user")
      .updateOne({ _id: session.user.id }, { $set: { role } });

    if (result.matchedCount === 0) {
      result = await db.collection("user").updateOne({ id: session.user.id }, { $set: { role } });
      if (result.matchedCount === 0) {
        try {
          const objectId = new mongoose.Types.ObjectId(session.user.id);
          result = await db.collection("user").updateOne({ _id: objectId }, { $set: { role } });
        } catch (e) {}

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found in database. Try logging out and back in." });
        }
      }
    }

    // Initialize shop entity for new vendors
    if (role === "vendor") {
      await ensureShop(session.user.id, session.user.name);
    }

    res.json({ success: true, role });
  } catch (error) {
    next(error);
  }
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Multi-Vendor E-Commerce Backend is Running!");
});

// Centralized Express error handler
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Client-caused Mongoose errors are 400s, not 500s
  if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${err.path}: ${String(err.value)}`;
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  }

  const response = { success: false, message };

  // Suppress stack traces in production environments to prevent leaking server architecture
  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
});

// Run backfill without crashing server startup on cold start
backfillShops().catch((err) => {
  console.error("Non-fatal backfill error at startup:", err);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
