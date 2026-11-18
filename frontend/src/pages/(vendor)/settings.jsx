import { useState, useEffect } from "react";
import {
  Store,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function VendorSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  // Payout Form state
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("Stripe Connect");
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutFeedback, setPayoutFeedback] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/vendor/profile", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setShopName(data.shopName || "");
        setDescription(data.description || "");
        setLogoUrl(data.logoUrl || "");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileFeedback(null);

    try {
      const res = await fetch("http://localhost:3000/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shopName, description, logoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileFeedback({ type: "error", message: data.message || "Failed to update profile" });
        return;
      }

      setProfile(data.shop);
      setProfileFeedback({ type: "success", message: "Store profile updated successfully!" });
      setTimeout(() => setProfileFeedback(null), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
      setProfileFeedback({ type: "error", message: "Network error saving settings" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setRequestingPayout(true);
    setPayoutFeedback(null);

    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPayoutFeedback({ type: "error", message: "Please enter a valid payout amount" });
      setRequestingPayout(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/vendor/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: amountNum, payoutMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPayoutFeedback({ type: "error", message: data.message || "Payout request failed" });
        return;
      }

      setProfile((prev) => ({ ...prev, balance: data.newBalance }));
      setPayoutAmount("");
      setPayoutFeedback({
        type: "success",
        message: data.message || `Payout of $${amountNum.toFixed(2)} requested successfully!`,
      });
      setTimeout(() => setPayoutFeedback(null), 4000);
    } catch (err) {
      console.error("Payout error:", err);
      setPayoutFeedback({ type: "error", message: "Network error requesting payout" });
    } finally {
      setRequestingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const balance = profile?.balance || 0;

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Store Settings & Financials
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your storefront profile, brand information, and request balance payouts.
        </p>
      </div>

      {/* Section 1: Financial Ledger & Payouts */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Earnings & Balance</h2>
            <p className="text-xs text-zinc-500">
              View your store ledger balance and request payouts directly to your account.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> 90% Vendor Payout Rate
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="text-xs font-medium text-zinc-500">Available Balance</div>
            <div className="mt-1 text-2xl font-bold font-mono text-zinc-900 dark:text-white">
              ${balance.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-zinc-400">Ready for withdrawal</div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="text-xs font-medium text-zinc-500">Platform Commission</div>
            <div className="mt-1 text-2xl font-bold font-mono text-zinc-900 dark:text-white">10%</div>
            <div className="mt-1 text-xs text-zinc-400">Standard platform fee</div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="text-xs font-medium text-zinc-500">Payout Processing</div>
            <div className="mt-1 text-2xl font-bold font-mono text-zinc-900 dark:text-white">Instant / 24h</div>
            <div className="mt-1 text-xs text-zinc-400">Stripe automated payouts</div>
          </div>
        </div>

        {payoutFeedback && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-lg border p-4 text-sm ${
              payoutFeedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
            }`}
          >
            {payoutFeedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {payoutFeedback.message}
          </div>
        )}

        {/* Payout Request Box */}
        <form onSubmit={handleRequestPayout} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Request a Balance Withdrawal</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">$</span>
              <input
                type="number"
                step="0.01"
                min="1.00"
                max={balance > 0 ? balance : undefined}
                placeholder="0.00"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                disabled={balance <= 0 || requestingPayout}
                className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-7 pr-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              disabled={balance <= 0 || requestingPayout}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white disabled:opacity-50"
            >
              <option value="Stripe Connect">Stripe Connect (Direct)</option>
              <option value="Bank Transfer">Bank Wire Transfer</option>
            </select>

            <Button
              type="submit"
              disabled={balance <= 0 || requestingPayout || !payoutAmount}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 disabled:opacity-50"
            >
              {requestingPayout ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Withdraw <ArrowUpRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          {balance <= 0 && (
            <p className="mt-2 text-xs text-zinc-500">
              You currently have $0.00 available. Payouts become available once customer orders are placed and paid.
            </p>
          )}
        </form>
      </div>

      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      {/* Section 2: Storefront Profile */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Store Profile</h2>
            <p className="text-xs text-zinc-500">Customize how your store appears to customers on the platform.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Status:</span>
            {profile?.isActive ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                Active & Approved
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                Pending Approval
              </span>
            )}
          </div>
        </div>

        {profileFeedback && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-lg border p-4 text-sm ${
              profileFeedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400"
            }`}
          >
            {profileFeedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {profileFeedback.message}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Shop Name *</label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Acme Studio"
              className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Store Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your craft, shipping policies, or background..."
              className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
            {logoUrl.trim() && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="h-10 w-10 rounded-full border border-zinc-200 object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <span className="text-xs text-zinc-500">Logo preview valid</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={savingProfile}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
