import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function Landing() {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <header className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 font-medium">
          <ShoppingBag className="h-5 w-5" />
          EasyBay
        </div>
        <div>
          {!isPending && !session && (
            <Link to="/login" className="text-sm font-medium hover:underline text-zinc-600 dark:text-zinc-300">
              Log in
            </Link>
          )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 text-center pt-24 pb-32">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-950 dark:text-white max-w-3xl mb-6 leading-[1.1]">
          The minimal, powerful <br className="hidden md:block" />
          platform for modern vendors.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mb-10">
          Everything you need to sell online. No clutter, no unnecessary friction. Just the best tools to run your business.
        </p>

        <div className="w-full max-w-md">
          {isPending ? (
            <div className="flex h-12 items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"></div>
            </div>
          ) : session ? (
            <div className="flex flex-col items-center p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
              <div className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                Signed in as <span className="font-medium text-zinc-900 dark:text-white">{session.user.email}</span>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <Button asChild className="flex-1 shadow-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                  <Link to="/dashboard">
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="shadow-none border-zinc-200 dark:border-zinc-800" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild className="h-11 px-8 shadow-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                <Link to="/signup">
                  Start Selling
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 px-8 shadow-none border-zinc-200 dark:border-zinc-800">
                <Link to="/login">
                  Vendor Login
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
