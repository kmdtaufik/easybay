import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const wishlistItems = [
    { id: 3, name: "Minimalist Wall Clock", price: 120.00, vendor: "Timepiece Co", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=300" },
    { id: 7, name: "Stainless Steel Water Bottle", price: 35.00, vendor: "Hydro Co", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=300" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Wishlist
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Items you've saved for later.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md border border-zinc-100 dark:border-zinc-800">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <button className="absolute right-2 top-2 rounded-full bg-white/80 p-2 text-red-500 backdrop-blur-sm transition-colors hover:bg-white dark:bg-zinc-950/80 dark:hover:bg-zinc-900">
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <h3 className="font-medium text-zinc-900 dark:text-white">{item.name}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">By {item.vendor}</p>
              <span className="font-medium text-zinc-900 dark:text-white">${item.price.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-auto bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
