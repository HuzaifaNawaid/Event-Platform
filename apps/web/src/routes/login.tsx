import { useState } from "react";

import PageWrapper from "@/components/page-wrapper";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function Login() {
	const [showSignIn, setShowSignIn] = useState(true);

	return (
		<PageWrapper className="flex items-center justify-center py-12">
			<div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
				{showSignIn ? (
					<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
				) : (
					<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
				)}
			</div>
		</PageWrapper>
	);
}
