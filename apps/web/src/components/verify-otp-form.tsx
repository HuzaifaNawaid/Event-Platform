import { useEffect, useState } from "react";
import { Button } from "@aws-platform/ui/components/button";
import { Input } from "@aws-platform/ui/components/input";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Mail } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function VerifyOtpForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!email || otpSent) return;
    setOtpSent(true);
    authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
  }, [email, otpSent]);

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    if (error) {
      toast.error(error.message || "Failed to resend code");
    } else {
      toast.success("New code sent to your email");
      startCooldown();
    }
    setIsResending(false);
  };

  const handleVerify = async () => {
    if (!email || otp.length !== 6) return;

    setIsVerifying(true);
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });
    if (error) {
      toast.error(error.message || "Invalid or expired code");
    } else {
      toast.success("Email verified successfully!");
      navigate("/login");
    }
    setIsVerifying(false);
  };

  if (!email) {
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
          <p className="text-sm text-muted-foreground">No email provided. Please sign up again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center space-y-1">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Verify Your Email</h1>
          <p className="text-xs text-muted-foreground">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-medium text-foreground flex items-center justify-center gap-1">
            <Mail className="size-3" />
            {email}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Verification Code</label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-lg tracking-[0.5em] font-mono"
              autoFocus
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full bg-[#FF9900] text-black font-semibold hover:bg-[#E68A00] transition-colors"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : isResending
                  ? "Sending..."
                  : "Didn't receive a code? Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
