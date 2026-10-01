import { useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, CreditCard } from "lucide-react";

export default function Settings() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account preferences and details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <nav className="flex flex-col gap-2">
          <a href="#" className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white">
            <User className="h-4 w-4" /> Profile
          </a>
          <a href="#" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white">
            <Shield className="h-4 w-4" /> Security
          </a>
          <a href="#" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white">
            <CreditCard className="h-4 w-4" /> Payment Methods
          </a>
          <a href="#" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white">
            <Bell className="h-4 w-4" /> Notifications
          </a>
        </nav>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-lg font-medium text-zinc-950 dark:text-white">Profile Information</h2>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900 dark:text-white">Name</label>
                <input 
                  type="text" 
                  defaultValue={session?.user?.name || ""}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900 dark:text-white">Email</label>
                <input 
                  type="email" 
                  defaultValue={session?.user?.email || ""}
                  disabled
                  className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 opacity-70 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                />
                <p className="text-xs text-zinc-500">Your email cannot be changed at this time.</p>
              </div>
              <Button className="mt-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
