"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { Header } from "@/components/header";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function LogIn() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }

      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6 fill-primary text-primary" />
              <span className="text-xl font-serif font-bold text-foreground">
                Weddings
              </span>
            </Link>
            <h1 className="heading-elegant text-3xl mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to continue planning your wedding
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg">
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium">
                Create One
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
