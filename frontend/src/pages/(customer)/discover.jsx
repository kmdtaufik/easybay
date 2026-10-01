import { Search, ChevronRight, Store, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Discover() {
  const dummyProducts = [
    { id: 1, name: "Matte Black Desk Mat", price: 34.99, vendor: "Studio Works", image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80&w=600" },
    { id: 2, name: "Ergonomic Aluminum Stand", price: 59.00, vendor: "Elevation", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600" },
    { id: 3, name: "Minimalist Wall Clock", price: 120.00, vendor: "Timepiece Co", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=600" },
    { id: 4, name: "Ceramic Pour-Over Dripper", price: 45.50, vendor: "Brewed", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600" },
    { id: 5, name: "Linen Blend Throw Pillow", price: 28.00, vendor: "Cozy Home", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600" },
    { id: 6, name: "Wireless Mechanical Keyboard", price: 149.99, vendor: "Keychron", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600" },
    { id: 7, name: "Stainless Steel Water Bottle", price: 35.00, vendor: "Hydro Co", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600" },
    { id: 8, name: "Geometric Bookends", price: 42.00, vendor: "Form & Function", image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Discover
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Explore the latest products from independent vendors.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-400 dark:focus:border-white dark:focus:ring-white"
          />
        </div>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {["Electronics", "Apparel", "Home Goods", "Art & Design"].map((cat) => (
          <a 
            key={cat} 
            href="#"
            className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white"
          >
            <span className="text-sm font-medium text-zinc-900 dark:text-white">{cat}</span>
            <div className="mt-4 flex items-center text-xs text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
              Shop category <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </a>
        ))}
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
          Trending Now
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dummyProducts.map((p) => (
            <div key={p.id} className="group flex flex-col">
              <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                <img 
                  src={p.image} 
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                <Button 
                  size="icon" 
                  variant="secondary"
                  className="absolute bottom-3 right-3 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:scale-105"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white cursor-pointer hover:underline">
                    {p.name}
                  </h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">By {p.vendor}</span>
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  ${p.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
