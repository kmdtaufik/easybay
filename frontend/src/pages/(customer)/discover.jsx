import { useState, useEffect } from "react";
import { Search, ChevronRight, Store, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Discover() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3000/api/products", {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingToCart(productId);
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (res.ok) {
        // Optional: show a toast success message
        console.log("Added to cart!");
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAddingToCart(null);
    }
  };

  const dummyProducts = [
    { _id: "dummy1", title: "Matte Black Desk Mat", price: 34.99, vendorId: "Studio Works", images: ["https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80&w=600"] },
    { _id: "dummy2", title: "Ergonomic Aluminum Stand", price: 59.00, vendorId: "Elevation", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600"] },
    { _id: "dummy3", title: "Minimalist Wall Clock", price: 120.00, vendorId: "Timepiece Co", images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=600"] },
    { _id: "dummy4", title: "Ceramic Pour-Over Dripper", price: 45.50, vendorId: "Brewed", images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600"] },
  ];

  const displayProducts = products.length > 0 ? products : dummyProducts;

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
        <div className="mb-6 flex items-center gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
            Trending Now
          </h2>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
        </div>
        
        {displayProducts.length === 0 && !loading ? (
          <div className="py-10 text-center text-zinc-500">No products available.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayProducts.map((p) => (
              <div key={p._id} className="group flex flex-col">
                <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                  <img 
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600"} 
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                  <Button 
                    size="icon" 
                    variant="secondary"
                    onClick={() => handleAddToCart(p._id)}
                    disabled={addingToCart === p._id || p._id.startsWith('dummy')}
                    className="absolute bottom-3 right-3 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:scale-105 disabled:opacity-50"
                  >
                    {addingToCart === p._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white cursor-pointer hover:underline">
                      {p.title}
                    </h3>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">By {p.vendorId}</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    ${p.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
