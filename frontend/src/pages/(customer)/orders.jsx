import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, ShoppingBag, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Failed to fetch customer orders:", err);
      setError("Network error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "Shipped":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "Processing":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
      case "Cancelled":
        return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Track fulfillment status, review items, and manage purchase history.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
            <PackageSearch className="h-8 w-8 text-zinc-400" />
          </div>
          <h2 className="mb-2 text-lg font-medium text-zinc-950 dark:text-white">No orders placed yet</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Items you purchase from independent sellers will appear here.
          </p>
          <Link to="/dashboard/discover">
            <Button variant="outline">Browse Storefront</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const firstItem = order.items?.[0];
            const summaryText =
              order.items && order.items.length > 1
                ? `${firstItem?.productId?.title || "Item"} + ${order.items.length - 1} more item(s)`
                : firstItem?.productId?.title || "Product Purchase";

            const overallStatus = firstItem?.fulfillmentStatus || "Processing";

            return (
              <div
                key={order._id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                      #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${getStatusBadge(overallStatus)}`}>
                      {overallStatus}
                    </span>
                    <span className="text-xs text-zinc-500 capitalize">
                      • Payment: {order.paymentStatus || "paid"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })} • <span className="font-mono font-medium text-zinc-900 dark:text-white">${order.totalAmount?.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                    {summaryText}
                  </p>
                </div>

                <div className="flex sm:flex-col sm:items-end gap-2">
                  <span className="text-xs text-zinc-400">
                    {order.items?.length || 1} line item(s)
                  </span>
                  <Link
                    to="/dashboard/discover"
                    className="text-xs font-medium text-zinc-900 dark:text-white hover:underline"
                  >
                    Buy Again
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
