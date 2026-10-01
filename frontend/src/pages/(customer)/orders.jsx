import { PackageSearch } from "lucide-react";

export default function Orders() {
  const dummyOrders = [
    { id: "ORD-9381-XYZ", date: "Sep 20, 2026", status: "Delivered", total: 45.50, item: "Ceramic Pour-Over Dripper" },
    { id: "ORD-4822-ABC", date: "Sep 15, 2026", status: "Processing", total: 149.99, item: "Wireless Mechanical Keyboard" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Track, return, or buy items again.
        </p>
      </div>

      <div className="space-y-4">
        {dummyOrders.map(order => (
          <div key={order.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-zinc-900 dark:text-white">{order.id}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  order.status === 'Delivered' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{order.date} • ${order.total.toFixed(2)}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">{order.item}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              <button className="text-sm font-medium text-zinc-900 dark:text-white hover:underline">
                View Details
              </button>
              <button className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                Track Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
