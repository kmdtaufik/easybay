import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        // The API populates item.productId as the actual product object
        setCartItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemovingItem(productId);
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${productId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setRemovingItem(null);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Shopping Cart
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Review your items before checkout.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
            <ShoppingCart className="h-8 w-8 text-zinc-400" />
          </div>
          <h2 className="mb-2 text-lg font-medium text-zinc-950 dark:text-white">Your cart is empty</h2>
          <p className="mb-6 text-sm text-zinc-500">Looks like you haven't added anything yet.</p>
          <Button variant="outline">Start Shopping</Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null; // Defensive check
              return (
                <div key={product._id} className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-zinc-100 dark:border-zinc-800">
                    <img 
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=300"} 
                      alt={product.title} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-zinc-900 dark:text-white">{product.title}</h3>
                        <p className="text-sm text-zinc-500">By {product.vendorId}</p>
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white">${product.price?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500">Qty: {item.quantity}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveItem(product._id)}
                        disabled={removingItem === product._id}
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        {removingItem === product._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900 h-fit">
            <h2 className="font-medium text-zinc-950 dark:text-white">Order Summary</h2>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <Separator className="my-2 bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex justify-between font-medium text-zinc-900 dark:text-white">
              <span>Estimated Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button className="mt-4 w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
