import { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Package,
  ChevronDown,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/orders", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const err = await res.json();
        setFeedback({ type: "error", message: err.message || "Failed to load orders" });
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setFeedback({ type: "error", message: "Network error loading orders" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, itemId = null) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus, itemId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.message || "Failed to update status" });
        return;
      }

      // Update in local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data.order } : o))
      );

      setFeedback({
        type: "success",
        message: `Order #${orderId.slice(-6).toUpperCase()} status updated to "${newStatus}"`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error("Update status error:", err);
      setFeedback({ type: "error", message: "Network error updating order status" });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((i) => i.productId?.title?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;

    // Check if any vendor items match statusFilter
    const items = order.vendorItems || order.items || [];
    return items.some(
      (item) => item.fulfillmentStatus?.toLowerCase() === statusFilter.toLowerCase()
    );
  });

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
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Order Fulfillment
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track customer purchases, update shipping stages, and fulfill your store items.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          className="gap-2 border-zinc-200 dark:border-zinc-800"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {feedback && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-lg border p-4 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400"
              : "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {feedback.message}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap capitalize ${
                statusFilter.toLowerCase() === status.toLowerCase()
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
            <Inbox className="h-8 w-8 text-zinc-400" />
          </div>
          <h2 className="mb-1 text-base font-semibold text-zinc-950 dark:text-white">
            {searchQuery || statusFilter !== "all" ? "No matching orders" : "No orders yet"}
          </h2>
          <p className="text-xs text-zinc-500 max-w-sm">
            {searchQuery || statusFilter !== "all"
              ? "Try changing your search query or status filter."
              : "When customers purchase your listed products, their orders will appear here for fulfillment."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const vendorItems = order.vendorItems || order.items || [];
            const subtotal = order.vendorSubtotal || vendorItems.reduce(
              (acc, item) => acc + (item.priceAtPurchase || 0) * (item.quantity || 1),
              0
            );
            const isUpdating = updatingOrderId === order._id;

            return (
              <div
                key={order._id}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-white">
                      #{order._id.toUpperCase()}
                    </span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      Payment: {order.paymentStatus || "pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Update status:</span>
                    <select
                      disabled={isUpdating}
                      value={vendorItems[0]?.fulfillmentStatus || "Processing"}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  {vendorItems.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                          {item.productId?.images?.[0] ? (
                            <img
                              src={item.productId.images[0]}
                              alt={item.productId.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                              <Package className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-white">
                            {item.productId?.title || "Product item"}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Unit Price: ${item.priceAtPurchase?.toFixed(2)} × Qty: {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                            item.fulfillmentStatus
                          )}`}
                        >
                          {item.fulfillmentStatus || "Processing"}
                        </span>
                        <span className="font-mono text-sm font-medium text-zinc-900 dark:text-white">
                          ${((item.priceAtPurchase || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <span className="text-zinc-500">
                    Customer ID: <span className="font-mono text-zinc-700 dark:text-zinc-300">{order.customerId}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Your Net Earnings (90%):</span>
                    <span className="font-mono font-semibold text-sm text-zinc-950 dark:text-white">
                      ${(subtotal * 0.9).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
