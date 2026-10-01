import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/landing";
import Login from "./pages/(auth)/login";
import Signup from "./pages/(auth)/signup";
import Onboarding from "./pages/(auth)/onboarding";

// Customer Dashboard
import CustomerLayout from "./pages/(customer)/layout";
import Discover from "./pages/(customer)/discover";
import Cart from "./pages/(customer)/cart";
import Orders from "./pages/(customer)/orders";
import Wishlist from "./pages/(customer)/wishlist";
import Settings from "./pages/(customer)/settings";

// Vendor Dashboard
import VendorLayout from "./pages/(vendor)/layout";
import VendorDashboard from "./pages/(vendor)/dashboard";
import VendorProducts from "./pages/(vendor)/products";
import VendorOrders from "./pages/(vendor)/orders";
import VendorSettings from "./pages/(vendor)/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Protected Dashboard Route (Customer) */}
        <Route path="/dashboard" element={<CustomerLayout />}>
          <Route index element={<Navigate to="discover" replace />} />
          <Route path="discover" element={<Discover />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Protected Dashboard Route (Vendor) */}
        <Route path="/vendor" element={<VendorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="settings" element={<VendorSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
