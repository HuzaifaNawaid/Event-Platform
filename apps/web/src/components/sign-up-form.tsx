import { useState } from "react";
import { Button } from "@aws-platform/ui/components/button";
import { Input } from "@aws-platform/ui/components/input";
import { Label } from "@aws-platform/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import Loader from "./loader";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);     //functionality to show and hide password using eye icon

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"), // Fixed z.string().email()
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: () => {
            navigate(`/verify-otp?email=${encodeURIComponent(value.email)}`);
            toast.success("Account created! check your email for verification code.");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center space-y-1">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
            <UserPlus className="size-5"/>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Create Account</h1>
          <p className="text-xs text-muted-foreground">Get started with your AWS Builder Group Bahria University</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Full Name
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors?.map((err, i) => (
                  <p key={i} className="text-xs text-destructive">
                    {typeof err === "string" ? err : err?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Email Address
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="name@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors?.map((err, i) => (
                  <p key={i} className="text-xs text-destructive">
                    {typeof err === "string" ? err : err?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="pr-10"
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
                {field.state.meta.errors?.map((err, i) => (
                  <p key={i} className="text-xs text-destructive">
                    {typeof err === "string" ? err : err?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}>
            {({ canSubmit, isSubmitting }) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full bg-[#FF9900] text-black font-semibold hover:bg-[#E68A00] transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-semibold text-foreground underline hover:text-primary transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}