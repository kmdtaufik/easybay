import { auth } from "../auth.js";

// Middleware to check authentication and attach session to req
export const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.session = session;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware to check if user is a vendor
export const requireVendor = (req, res, next) => {
  if (req.session?.user?.role !== "vendor") {
    return res.status(403).json({ error: "Forbidden: Vendor access required" });
  }
  next();
};

// Middleware to check if user is a customer
export const requireCustomer = (req, res, next) => {
  if (req.session?.user?.role !== "customer") {
    return res.status(403).json({ error: "Forbidden: Customer access required" });
  }
  next();
};

// Middleware to check if user is an admin
export const requireAdmin = (req, res, next) => {
  if (req.session?.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};
