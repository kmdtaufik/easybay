import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const cartItems = [
    { id: 1, name: "Matte Black Desk Mat", price: 34.99, vendor: "Studio Works", quantity: 1, image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80&w=300" },
    { id: 4, name: "Ceramic Pour-Over Dripper", price: 45.50, vendor: "Brewed", quantity: 2, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=300" },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-zinc-100 dark:border-zinc-800">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-white">{item.name}</h3>
                      <p className="text-sm text-zinc-500">By {item.vendor}</p>
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-white">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-zinc-500">Qty: {item.quantity}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
