import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, Loader2 } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const [loadingRole, setLoadingRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    } else if (session?.user?.role) {
      navigate("/dashboard");
    }
  }, [session, isPending, navigate]);

  const selectRole = async (role) => {
    setLoadingRole(role);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
        credentials: "include", // Essential for sending Better Auth session cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to set role.");
        return;
      }
      
      if (data.success) {
        // Refetch session so the authClient has the latest role
        await authClient.getSession();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error setting role:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoadingRole(null);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 dark:bg-zinc-950">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Welcome to EasyBay
        </h1>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">
          To give you the best experience, please tell us how you plan to use the platform.
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Customer Option */}
          <button
            onClick={() => selectRole("customer")}
            disabled={loadingRole !== null}
            className={`group relative flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-8 text-center transition-all hover:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white ${
              loadingRole === "customer" ? "border-zinc-900 dark:border-white" : ""
            }`}
          >
            <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
              <ShoppingBag className="h-8 w-8 text-zinc-900 dark:text-white" />
            </div>
            <h2 className="mb-2 text-xl font-medium text-zinc-950 dark:text-white">
              I want to Buy
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Browse products, track orders, and shop from hundreds of independent vendors.
            </p>
            {loadingRole === "customer" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-900 dark:text-white" />
              </div>
            )}
          </button>

          {/* Vendor Option */}
          <button
            onClick={() => selectRole("vendor")}
            disabled={loadingRole !== null}
            className={`group relative flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-8 text-center transition-all hover:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white ${
              loadingRole === "vendor" ? "border-zinc-900 dark:border-white" : ""
            }`}
          >
            <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
              <Store className="h-8 w-8 text-zinc-900 dark:text-white" />
            </div>
            <h2 className="mb-2 text-xl font-medium text-zinc-950 dark:text-white">
              I want to Sell
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Set up a storefront, manage inventory, and reach millions of customers.
            </p>
            {loadingRole === "vendor" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-900 dark:text-white" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
