export default function VendorOrders() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Orders
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage fulfillment for your customer orders.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-2 text-lg font-medium text-zinc-950 dark:text-white">No orders yet</h2>
        <p className="text-sm text-zinc-500">When customers buy your products, their orders will appear here.</p>
      </div>
    </div>
  );
}
