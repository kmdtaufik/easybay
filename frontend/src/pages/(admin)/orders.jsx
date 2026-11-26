import { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/admin/orders", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to load platform orders");
      }
    } catch (err) {
      console.error("Fetch admin orders error:", err);
      setError("Network error loading platform orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((i) => i.productId?.title?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (paymentFilter === "paid") return order.paymentStatus === "paid";
    if (paymentFilter === "pending") return order.paymentStatus === "pending";

    return true;
  });

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
            Global Orders Oversight
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Audit master order transactions, customer payments, and multi-vendor delivery stages.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          className="gap-2 border-zinc-200 dark:border-zinc-800"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Orders
        </Button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Orders" },
            { id: "paid", label: "Paid" },
            { id: "pending", label: "Pending Payment" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPaymentFilter(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                paymentFilter === tab.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-zinc-400 mb-3" />
            <h3 className="text-base font-medium text-zinc-950 dark:text-white mb-1">
              No orders found
            </h3>
            <p className="text-xs text-zinc-500">
              Orders placed by customers will appear here for platform auditing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Customer ID</th>
                  <th className="px-6 py-3">Line Items</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">10% Platform Fee</th>
                  <th className="px-6 py-3 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredOrders.map((order) => {
                  const fee = (order.totalAmount || 0) * 0.1;
                  return (
                    <tr key={order._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-900 dark:text-white">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                        {order.customerId}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-700 dark:text-zinc-300">
                        {order.items?.length || 0} product(s)
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-white">
                        ${(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        +${fee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          }`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
