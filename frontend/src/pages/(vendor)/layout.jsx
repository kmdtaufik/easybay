import { useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useSession, authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  Settings, 
  LogOut, 
  Store,
  Package,
  TrendingUp,
  Inbox
} from "lucide-react";

export default function VendorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        navigate("/login");
      } else if (!session.user.role) {
        navigate("/onboarding");
      } else if (session.user.role === "customer") {
        navigate("/dashboard");
      } else if (location.pathname === "/vendor") {
        navigate("/vendor/dashboard");
      }
    }
  }, [session, isPending, navigate, location.pathname]);

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/");
  };

  if (isPending || !session || session.user.role !== "vendor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const vendorLinks = [
    { name: "Overview", icon: TrendingUp, href: "/vendor/dashboard" },
    { name: "My Products", icon: Package, href: "/vendor/products" },
    { name: "Orders", icon: Inbox, href: "/vendor/orders" },
    { name: "Store Settings", icon: Settings, href: "/vendor/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:flex">
        <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-zinc-950 dark:text-white">
            <Store className="h-5 w-5" />
            Vendor Central
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-1">
            <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Management
            </div>
            {vendorLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="space-y-4">
            <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-900 dark:border-zinc-800 dark:bg-white">
                <span className="text-sm font-medium text-white dark:text-zinc-900">
                  {session.user.name?.charAt(0).toUpperCase() || "V"}
                </span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                  {session.user.name || "Vendor"}
                </span>
                <span className="truncate text-xs text-zinc-500">
                  Seller Account
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-zinc-600 shadow-none border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-zinc-950 dark:text-white">
            <Store className="h-5 w-5" />
            Vendor Central
          </Link>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="shadow-none border-zinc-200 dark:border-zinc-800">
            Sign Out
          </Button>
        </header>

        {/* Dashboard Content (Injected by Outlet) */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
