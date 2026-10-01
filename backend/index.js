import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth, db } from "./auth.js";
import mongoose from "mongoose";

import productRoutes from "./routes/products.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());

// Mount the products router
app.use("/api/products", productRoutes);

app.post("/api/onboarding", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { role } = req.body;
    if (role !== "vendor" && role !== "customer") {
      return res.status(400).json({ error: "Invalid role" });
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
            .json({ error: "User not found in database. Try logging out and back in." });
        }
      }
    }

    res.json({ success: true, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Multi-Vendor E-Commerce Backend is Running!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
