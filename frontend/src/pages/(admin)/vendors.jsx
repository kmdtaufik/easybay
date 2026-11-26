import { useState, useEffect } from "react";
import {
  Store,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminVendors() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/admin/shops", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setShops(data);
      } else {
        const err = await res.json();
        setFeedback({ type: "error", message: err.message || "Failed to load shops" });
      }
    } catch (err) {
      console.error("Fetch shops error:", err);
      setFeedback({ type: "error", message: "Network error loading vendor directory" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (shopId, currentStatus) => {
    setUpdatingId(shopId);
    const newStatus = !currentStatus;
    try {
      const res = await fetch(`http://localhost:3000/api/admin/shops/${shopId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.message || "Failed to update shop status" });
        return;
      }

      setShops((prev) =>
        prev.map((s) => (s._id === shopId ? { ...s, isActive: newStatus } : s))
      );

      setFeedback({
        type: "success",
        message: `Shop "${data.shop.shopName}" ${newStatus ? "approved and active" : "suspended"}`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error("Status toggle error:", err);
      setFeedback({ type: "error", message: "Network error updating shop status" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.vendorId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "active") return shop.isActive;
    if (statusFilter === "suspended") return !shop.isActive;

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
            Vendor Storefronts
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Review vendor applications, monitor ledger balances, and enforce shop status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchShops}
          className="gap-2 border-zinc-200 dark:border-zinc-800"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Directory
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
            placeholder="Search by shop or vendor ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Vendors" },
            { id: "active", label: "Active" },
            { id: "suspended", label: "Suspended / Pending" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab.id
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
        {filteredShops.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="mx-auto h-8 w-8 text-zinc-400 mb-3" />
            <h3 className="text-base font-medium text-zinc-950 dark:text-white mb-1">
              No matching vendors found
            </h3>
            <p className="text-xs text-zinc-500">
              Try adjusting your search criteria or register a new vendor account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3">Store Details</th>
                  <th className="px-6 py-3">Vendor Owner ID</th>
                  <th className="px-6 py-3">Ledger Balance</th>
                  <th className="px-6 py-3">Store Status</th>
                  <th className="px-6 py-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredShops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-white">{shop.shopName}</div>
                        <div className="text-xs text-zinc-500 line-clamp-1 max-w-xs">
                          {shop.description || "Vendor storefront"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {shop.vendorId}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-white">
                      ${(shop.balance || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {shop.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Active & Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                          <XCircle className="h-3 w-3" /> Suspended / Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant={shop.isActive ? "outline" : "default"}
                        onClick={() => handleToggleStatus(shop._id, shop.isActive)}
                        disabled={updatingId === shop._id}
                        className={`h-8 text-xs ${
                          shop.isActive
                            ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/20"
                            : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                        }`}
                      >
                        {updatingId === shop._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : shop.isActive ? (
                          "Suspend Vendor"
                        ) : (
                          "Approve Store"
                        )}
                      </Button>
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
