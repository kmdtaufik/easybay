import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaGoogle, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Login to your vendor dashboard</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" type="button">
              <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
              Google
            </Button>
            <Button variant="outline" type="button">
              <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            <Button variant="outline" type="button">
              <FaLinkedin className="mr-2 h-4 w-4 text-blue-700" />
              LinkedIn
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m.taufik.khan@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="ml-1 text-blue-600 hover:underline">
            Sign up
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
