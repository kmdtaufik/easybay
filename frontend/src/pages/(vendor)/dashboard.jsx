import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";

export default function VendorDashboard() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Overview
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Monitor your store's performance and recent activity.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Revenue</h3>
            <DollarSign className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">$0.00</div>
          <p className="text-xs text-zinc-500 mt-1">+0% from last month</p>
        </div>
        
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Orders</h3>
            <ShoppingBag className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">0</div>
          <p className="text-xs text-zinc-500 mt-1">Awaiting fulfillment</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Products</h3>
            <Package className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">0</div>
          <p className="text-xs text-zinc-500 mt-1">In your catalog</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Store Views</h3>
            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">0</div>
          <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">Welcome to your store</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">
          You haven't listed any products yet. Add your first product to start selling.
        </p>
        <a href="/vendor/products" className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-900/90 focus:outline-none dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90">
          Add a Product
        </a>
      </div>
    </div>
  );
}
