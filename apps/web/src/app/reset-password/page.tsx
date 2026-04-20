"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Invalid or expired reset link</h2>
          <p className="text-slate-600">Please request a new password reset link from the login page.</p>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Password Reset!</h2>
          <p className="text-slate-600 mb-4">Your password has been updated. You can now log in.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-2 text-sm">{error}</div>}
            <Input
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Reset Password"}</Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
