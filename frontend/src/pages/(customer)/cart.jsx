import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  MapPin,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);

  // Checkout modal & process states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
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
        credentials: "include",
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

  const handleOpenCheckout = () => {
    setCheckoutError(null);
    setIsCheckoutOpen(true);
  };

  const handleExecuteCheckout = async () => {
    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setCheckoutError(data.message || "Failed to process checkout");
        return;
      }

      // Success
      setOrderSuccess(data.order);
      setCartItems([]);
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError("Network error occurred during checkout");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="mx-auto max-w-xl text-center py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Thank you for shopping at EasyBay. Your order has been registered and sent to the independent vendors for fulfillment.
          </p>

          <div className="my-6 rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex justify-between text-xs py-1">
              <span className="text-zinc-500">Order ID:</span>
              <span className="font-mono font-medium text-zinc-900 dark:text-white">#{orderSuccess._id}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-zinc-500">Total Paid:</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white">${orderSuccess.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-zinc-500">Payment Status:</span>
              <span className="capitalize font-medium text-emerald-600 dark:text-emerald-400">{orderSuccess.paymentStatus || "Paid"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/dashboard/orders")}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            >
              View My Orders
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/discover")}
              className="border-zinc-200 dark:border-zinc-800"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
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
          <Link to="/dashboard/discover">
            <Button variant="outline">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
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
                        <p className="text-xs text-zinc-500">Sold by vendor: {product.vendorId}</p>
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white font-mono">
                        ${product.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">Qty: {item.quantity}</span>
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
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-mono">$0.00</span>
              </div>
            </div>
            <Separator className="my-2 bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex justify-between font-semibold text-zinc-900 dark:text-white">
              <span>Estimated Total</span>
              <span className="font-mono text-lg">${subtotal.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleOpenCheckout}
              className="mt-4 w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-zinc-900 dark:text-white" />
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                  Checkout Confirmation
                </h2>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                disabled={checkingOut}
                className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {checkoutError}
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-white mb-1">
                  <MapPin className="h-3.5 w-3.5" /> Shipping Address
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  123 Market Street, Suite 400<br />
                  San Francisco, CA 94105, United States
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs font-semibold text-zinc-900 dark:text-white mb-2">
                  Items to Purchase ({cartItems.length})
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {cartItems.map((item) => (
                    <div key={item.productId._id} className="pt-2 first:pt-0 flex justify-between text-xs">
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-white line-clamp-1">
                          {item.productId.title}
                        </div>
                        <div className="text-zinc-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-mono text-zinc-900 dark:text-white">
                        ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-zinc-900 dark:text-white">
                      Direct Card Payment
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400">Encrypted</span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Transactions are encrypted and verified with vendors prior to dispatch.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-zinc-950 dark:text-white">Final Amount:</span>
                <span className="font-mono text-xl font-bold text-zinc-950 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCheckoutOpen(false)}
                  disabled={checkingOut}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExecuteCheckout}
                  disabled={checkingOut}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...
                    </>
                  ) : (
                    "Confirm & Pay Order"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
