import { auth } from "../auth.js";

// Middleware to check authentication and attach session & user to req
export const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.session = session;
    req.user = session.user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Configurable Role-Based Access Control (RBAC) middleware
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const role = req.user?.role || req.session?.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient privileges",
      });
    }
    next();
  };
};

// Role-specific convenience middlewares
export const requireVendor = requireRole(["vendor"]);
export const requireCustomer = requireRole(["customer"]);
export const requireAdmin = requireRole(["admin"]);
