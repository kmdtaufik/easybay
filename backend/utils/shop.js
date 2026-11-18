import Shop from "../models/Shop.js";
import { db } from "../auth.js";

// Atomically returns the vendor's shop, creating it if missing.
// Safe under concurrent calls: the unique index on vendorId is handled by retrying a read.
export const ensureShop = async (vendorId, displayName) => {
  const defaults = {
    shopName: `${displayName || "Vendor"}'s Shop`,
    description: "Welcome to our store",
    isActive: true, // dev default; admins can suspend via /api/admin/shops/:id/status
    balance: 0,
  };

  try {
    return await Shop.findOneAndUpdate(
      { vendorId },
      { $setOnInsert: { vendorId, ...defaults } },
      { upsert: true, new: true },
    );
  } catch (error) {
    if (error?.code === 11000) {
      return Shop.findOne({ vendorId });
    }
    throw error;
  }
};

// Idempotent startup migration for data created before the Shop model had
// `isActive` / `balance`, and for vendors who onboarded before shops were auto-created.
export const backfillShops = async () => {
  const [activeFix, balanceFix] = await Promise.all([
    Shop.updateMany({ isActive: { $exists: false } }, { $set: { isActive: true } }),
    Shop.updateMany({ balance: { $exists: false } }, { $set: { balance: 0 } }),
  ]);

  const vendors = await db.collection("user").find({ role: "vendor" }).toArray();
  let created = 0;
  for (const vendor of vendors) {
    const vendorId = String(vendor.id ?? vendor._id);
    const exists = await Shop.exists({ vendorId });
    if (!exists) {
      await ensureShop(vendorId, vendor.name);
      created++;
    }
  }

  const patched = activeFix.modifiedCount + balanceFix.modifiedCount;
  if (patched || created) {
    console.log(`Shop backfill: patched ${patched} field(s), created ${created} missing shop(s)`);
  }
};
