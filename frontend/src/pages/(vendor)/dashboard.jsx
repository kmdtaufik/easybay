import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VendorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/vendor/stats", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to load dashboard metrics");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Network error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const shop = stats?.shop || {};
  const recentOrders = stats?.recentOrders || [];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time overview of your store performance, orders, and earnings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/vendor/products">
            <Button className="h-9 gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <Store className="h-6 w-6 text-zinc-900 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                {shop.shopName || "My Store"}
              </h2>
              {shop.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Live & Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                  <Clock className="h-3 w-3" /> Pending Approval / Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {shop.description || "Vendor storefront on EasyBay"}
            </p>
          </div>
        </div>
        <Link to="/vendor/settings">
          <Button variant="outline" size="sm" className="h-8 text-xs border-zinc-200 dark:border-zinc-800">
            Edit Store Settings
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Available Balance</h3>
            <DollarSign className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            ${(stats?.balance || 0).toFixed(2)}
          </div>
          <p className="text-xs text-zinc-500 mt-1">90% net sales share</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Fulfillment Queue</h3>
            <Clock className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            {stats?.awaitingFulfillment || 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Orders requiring shipment</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Products</h3>
            <Package className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            {stats?.totalProducts || 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Listed in your inventory</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Orders</h3>
            <ShoppingBag className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Lifetime customer orders</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Recent Orders</h2>
            <p className="text-xs text-zinc-500">Orders containing items from your store</p>
          </div>
          <Link
            to="/vendor/orders"
            className="flex items-center text-xs font-medium text-zinc-900 hover:underline dark:text-zinc-200"
          >
            View all orders <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600 mb-3" />
            <h3 className="text-sm font-medium text-zinc-950 dark:text-white mb-1">No orders yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              When customers purchase your products, they will appear here ready for fulfillment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Your Subtotal</th>
                  <th className="px-6 py-3">Fulfillment</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-zinc-900 dark:text-zinc-200">
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                      {order.itemsSummary}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-medium text-zinc-900 dark:text-white">
                      ${order.vendorSubtotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.fulfillmentStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : order.fulfillmentStatus === "Shipped"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/vendor/orders"
                        className="text-xs font-medium text-zinc-900 hover:underline dark:text-white"
                      >
                        Fulfill
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
