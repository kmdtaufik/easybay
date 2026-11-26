import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingShops, setPendingShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, shopsRes] = await Promise.all([
        fetch("http://localhost:3000/api/admin/stats", { credentials: "include" }),
        fetch("http://localhost:3000/api/admin/shops", { credentials: "include" }),
      ]);

      if (statsRes.ok && shopsRes.ok) {
        const statsData = await statsRes.json();
        const shopsData = await shopsRes.json();
        setStats(statsData);
        setPendingShops(shopsData.filter((s) => !s.isActive));
      } else {
        setError("Failed to load admin dashboard data");
      }
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Network error loading admin stats");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveShop = async (shopId) => {
    setActionLoading(shopId);
    try {
      const res = await fetch(`http://localhost:3000/api/admin/shops/${shopId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: true }),
      });

      if (res.ok) {
        setPendingShops((prev) => prev.filter((s) => s._id !== shopId));
        // Refresh metrics
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Approve shop error:", err);
    } finally {
      setActionLoading(null);
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
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Platform Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time multi-vendor oversight, revenue reconciliation, and vendor approvals.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Platform GMV</h3>
            <DollarSign className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            ${(stats?.totalVolume || 0).toFixed(2)}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Total customer purchases</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Commission (10%)</h3>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${(stats?.platformCommission || 0).toFixed(2)}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Platform retained net revenue</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Vendors Active</h3>
            <Store className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            {stats?.activeShops || 0} / {stats?.totalShops || 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Approved seller storefronts</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Orders</h3>
            <ShoppingBag className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">
            {stats?.totalOrders || 0}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Processed across catalog</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 mb-8">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
              Shops Awaiting Approval ({pendingShops.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Stores pending verification or suspended from the public storefront
            </p>
          </div>
          <Link
            to="/admin/vendors"
            className="flex items-center text-xs font-medium text-zinc-900 hover:underline dark:text-zinc-200"
          >
            Manage All Vendors <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        {pendingShops.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500 mb-2" />
            All registered vendor shops are approved and active.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3">Shop Name</th>
                  <th className="px-6 py-3">Vendor ID</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {pendingShops.map((shop) => (
                  <tr key={shop._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                      {shop.shopName}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {shop.vendorId}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-300 max-w-xs truncate">
                      {shop.description || "No description provided"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleApproveShop(shop._id)}
                        disabled={actionLoading === shop._id}
                        className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                      >
                        {actionLoading === shop._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Approve Shop"
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

      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          to="/admin/vendors"
          className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
              <Store className="h-5 w-5 text-zinc-900 dark:text-white" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-semibold text-zinc-950 dark:text-white">Vendor Storefronts Directory</h3>
          <p className="mt-1 text-xs text-zinc-500">
            View full vendor shop details, ledger balances, and toggle active/suspended statuses.
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
              <ShoppingBag className="h-5 w-5 text-zinc-900 dark:text-white" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-semibold text-zinc-950 dark:text-white">Global Platform Orders</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Audit master order transactions, customer payments, and multi-vendor delivery statuses.
          </p>
        </Link>
      </div>
    </div>
  );
}
