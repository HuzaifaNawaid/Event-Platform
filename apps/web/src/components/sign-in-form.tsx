import { Button } from "@aws-platform/ui/components/button";
import { Input } from "@aws-platform/ui/components/input";
import { Label } from "@aws-platform/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const redirectUrl = searchParams.get("redirect") || "/dashboard";
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						navigate(redirectUrl);
						toast.success("Sign in successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="w-full">
			<h1 className="mb-6 text-center font-bold text-2xl text-zinc-100 sm:text-3xl">
				Welcome Back
			</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name} className="text-xs text-zinc-300">
									Email
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="email"
									placeholder="name@university.edu"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-400 text-xs">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="password">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name} className="text-xs text-zinc-300">
									Password
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
								/>
								{field.state.meta.errors.map((error) => (
									<p key={error?.message} className="text-red-400 text-xs">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<form.Subscribe
					selector={(state) => ({
						canSubmit: state.canSubmit,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<Button
							type="submit"
							className="w-full bg-[#FF9900] font-semibold text-black transition-colors hover:bg-[#cc7a00]"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "Signing In..." : "Sign In"}
						</Button>
					)}
				</form.Subscribe>
			</form>

			<div className="mt-4 text-center">
				<Button
					variant="link"
					onClick={onSwitchToSignUp}
					className="text-xs text-zinc-400 hover:text-zinc-200"
				>
					Need an account? Sign Up
				</Button>
			</div>
		</div>
	);
}
