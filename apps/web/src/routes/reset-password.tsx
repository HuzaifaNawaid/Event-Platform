import { useState } from "react";
import { Button } from "@aws-platform/ui/components/button";
import { Input } from "@aws-platform/ui/components/input";
import { Label } from "@aws-platform/ui/components/label";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || otp.length !== 6 || password.length < 8) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });
    if (error) {
      toast.error(error.message || "Failed to reset password");
    } else {
      setSuccess(true);
      toast.success("Password reset successful!");
    }
    setIsSubmitting(false);
  };

  if (!email) {
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
          <p className="text-sm text-muted-foreground">No email provided. Please start from forgot password.</p>
          <a href="/forgot-password" className="text-sm text-primary hover:underline mt-4 inline-block">
            Forgot Password
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/20 mb-4">
            <CheckCircle className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground mb-2">Password Reset!</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-[#FF9900] text-black font-semibold hover:bg-[#E68A00] transition-colors"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center space-y-1">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
            <Lock className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Reset Password</h1>
          <p className="text-xs text-muted-foreground">
            Enter the code sent to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="otp" className="text-xs font-semibold">
              Reset Code
            </Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-lg tracking-[0.5em] font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={otp.length !== 6 || password.length < 8 || password !== confirmPassword || isSubmitting}
            className="w-full bg-[#FF9900] text-black font-semibold hover:bg-[#E68A00] transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Resetting password...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}