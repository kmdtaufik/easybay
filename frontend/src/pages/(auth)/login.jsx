import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { ShoppingBag } from "lucide-react";
import { signIn } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950">
      {/* Left Column - Form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-sm space-y-8">
          
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 lg:hidden mb-12">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-semibold tracking-tight">EasyBay</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access your vendor dashboard.
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              type="button" 
              className="h-10 w-full font-normal shadow-none border-zinc-200 dark:border-zinc-800"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              className="h-10 w-full font-normal shadow-none border-zinc-200 dark:border-zinc-800"
            >
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 shadow-none border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-950"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 shadow-none border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-950"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-10 bg-zinc-900 text-white hover:bg-zinc-800 shadow-none dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-zinc-900 hover:underline dark:text-white">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Column - Minimalist Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-50 p-12 lg:flex border-l border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xl font-medium tracking-tight text-zinc-950 dark:text-white">
          <ShoppingBag className="h-6 w-6" />
          EasyBay
        </div>
        
        <div>
          <h2 className="mb-4 text-3xl font-medium tracking-tight text-zinc-950 dark:text-white leading-tight">
            Manage your commerce <br />
            with precision.
          </h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-sm">
            Everything you need to scale your business, wrapped in a tool that gets out of your way.
          </p>
        </div>
        
        <div className="text-sm text-zinc-400">
          © {new Date().getFullYear()} EasyBay Inc.
        </div>
      </div>
    </div>
  );
}
