"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pizza, ShoppingBag, Store } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "vendor">("customer");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Google Signup
  const handleGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        additionalData: {
          role,
        },
      });

      if (error) {
        setError(error.message || "Google signup failed");
        setGoogleLoading(false);
      }
    } catch {
      setError("Google signup failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Email Signup
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
      });

      if (error) {
        setError(error.message || "Failed to create account");
        return;
      }

      if (data) {
        router.push("/sign-in");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Pizza size={27} className="text-orange-500" />
            <h1 className="text-2xl font-bold">
              Pizza<span className="text-orange-500">Hub</span>
            </h1>
          </div>
        </Link>

        {/* Sign Up Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join PizzaHub and discover your favorite flavors.
            </p>
          </div>

          {/* Role Selection */}
          <div className="mt-7">
            <label className="mb-3 block text-sm font-medium">
              Create account as
            </label>

            <div className="grid grid-cols-2 gap-3">

              {/* Customer */}
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`rounded-xl border p-4 text-center transition ${
                  role === "customer"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-border bg-background"
                }`}
              >
                <ShoppingBag
                  size={24}
                  className={`mx-auto mb-2 ${
                    role === "customer"
                      ? "text-orange-500"
                      : "text-muted-foreground"
                  }`}
                />

                <p className="text-sm font-semibold">Customer</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Order delicious pizza
                </p>
              </button>

              {/* Vendor */}
              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`rounded-xl border p-4 text-center transition ${
                  role === "vendor"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-border bg-background"
                }`}
              >
                <Store
                  size={24}
                  className={`mx-auto mb-2 ${
                    role === "vendor"
                      ? "text-orange-500"
                      : "text-muted-foreground"
                  }`}
                />

                <p className="text-sm font-semibold">Vendor</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sell your pizzas
                </p>
              </button>

            </div>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background py-3 text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.653 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 5.053 29.268 3 24 3 12.402 3 3 12.402 3 24s9.402 21 21 21 21-9.402 21-21c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 5.053 29.268 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 45c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.154 36.087 26.715 37 24 37c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.644 41.995 16.328 45 24 45z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.01 12.01 0 0 0-4.084 6.57l6.19 5.238C41.018 35.83 45 30.277 45 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>

            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-orange-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-orange-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="flex items-center rounded-lg border border-border bg-background px-4 focus-within:border-orange-500">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 text-sm outline-none placeholder:text-muted-foreground"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <div className="flex items-center rounded-lg border border-border bg-background px-4 focus-within:border-orange-500">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full py-3 text-sm outline-none placeholder:text-muted-foreground"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Selected Role */}
            <p className="text-xs text-muted-foreground">
              Registering as:{" "}
              <span className="font-medium text-orange-500">
                {role === "customer" ? "Customer" : "Vendor"}
              </span>
            </p>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Sign In */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-orange-500 transition hover:text-orange-400"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Back Home */}
        <Link
          href="/"
          className="mt-6 block text-center text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Back to Home
        </Link>

      </div>
    </main>
  );
}