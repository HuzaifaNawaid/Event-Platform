import { useState } from "react";
import { Button } from "@aws-platform/ui/components/button";
import { Input } from "@aws-platform/ui/components/input";
import { Label } from "@aws-platform/ui/components/label";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft, CheckCircle, Lock } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const { error } = await authClient.emailOtp.requestPasswordReset({ email });
    if (error) {
      toast.error(error.message || "Failed to send reset code");
    } else {
      setSent(true);
      toast.success("Reset code sent to your email");
    }
    setIsSubmitting(false);
  };

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-md p-6">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/20 mb-4">
            <CheckCircle className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground mb-2">Check Your Email</h1>
          <p className="text-sm text-muted-foreground mb-6">
            We sent a reset code to <span className="font-medium text-foreground">{email}</span>
          </p>
          <a
            href={`/reset-password?email=${encodeURIComponent(email)}`}
            className="inline-flex items-center gap-2 bg-[#FF9900] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#E68A00] transition-colors"
          >
            Enter Reset Code
          </a>
          <div className="mt-4">
            <a
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="size-3" />
              Back to Sign In
            </a>
          </div>
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
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Forgot Password?</h1>
          <p className="text-xs text-muted-foreground">
            Enter your email and we'll send you a reset code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={!email || isSubmitting}
            className="w-full bg-[#FF9900] text-black font-semibold hover:bg-[#E68A00] transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Sending code...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Mail className="size-4" />
                Send Reset Code
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-3" />
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}