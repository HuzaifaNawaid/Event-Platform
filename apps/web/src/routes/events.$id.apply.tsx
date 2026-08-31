import { Button } from "@aws-platform/ui/components/button";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import * as React from "react";
import { Link, useNavigate, useParams } from "react-router";

import PageWrapper from "@/components/page-wrapper";
import RegistrationForm from "@/components/registration/registration-form";
import { authClient } from "@/lib/auth-client";
import { MOCK_EVENTS } from "./_index";

export function meta({ params }: { params: { id?: string } }) {
	const event = MOCK_EVENTS.find((e) => e.id === params.id) || MOCK_EVENTS[0];
	return [
		{ title: `Apply for ${event ? event.title : "Event"} | DevSoc Events` },
		{
			name: "description",
			content: "Complete your event registration and payment verification.",
		},
	];
}

export default function EventApply() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// TODO: [AUTH - Samar/Sameer] — verify authClient.useSession integration
	const { data: session, isPending: isAuthPending } = authClient.useSession();
	const user = session?.user;

	// TODO: [BACKEND - Waleed] — replace with real tRPC query: trpc.events.getById.useQuery({ id: id! })
	const event = React.useMemo(() => {
		return (
			MOCK_EVENTS.find((e) => e.id === id) ||
			(id === "1" ? MOCK_EVENTS[0] : null)
		);
	}, [id]);

	// Auth gate effect: If user is unauthenticated once auth resolves, redirect to sign-in
	React.useEffect(() => {
		if (!isAuthPending && !user) {
			navigate(`/login?redirect=${encodeURIComponent(`/events/${id}/apply`)}`, {
				replace: true,
			});
		}
	}, [isAuthPending, user, id, navigate]);

	// Loading state while verifying auth session
	if (isAuthPending) {
		return (
			<PageWrapper className="py-20">
				<div className="mx-auto max-w-md space-y-3 px-4 text-center">
					<Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FF9900]" />
					<p className="text-sm text-zinc-400">
						Verifying session credentials...
					</p>
				</div>
			</PageWrapper>
		);
	}

	// If unauthenticated (and pending redirect)
	if (!user) {
		return (
			<PageWrapper className="py-20">
				<div className="mx-auto max-w-md space-y-4 px-4 text-center">
					<ShieldAlert className="mx-auto h-10 w-10 text-[#FF9900]" />
					<h2 className="font-semibold text-xl text-zinc-100">
						Authentication Required
					</h2>
					<p className="text-sm text-zinc-400">
						You must be signed in to submit an application. Redirecting to sign
						in...
					</p>
					<Link
						to={`/login?redirect=${encodeURIComponent(`/events/${id}/apply`)}`}
					>
						<Button className="bg-[#FF9900] font-semibold text-black hover:bg-[#cc7a00]">
							Go to Sign In
						</Button>
					</Link>
				</div>
			</PageWrapper>
		);
	}

	// If event not found
	if (!event) {
		return (
			<PageWrapper className="py-16">
				<div className="mx-auto max-w-md space-y-4 px-4 text-center">
					<h2 className="font-bold text-xl text-zinc-100">Event Not Found</h2>
					<p className="text-sm text-zinc-400">The event could not be found.</p>
					<Link to="/">
						<Button
							variant="outline"
							className="border-zinc-700 bg-zinc-800 text-zinc-200"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to events
						</Button>
					</Link>
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper className="py-10">
			<div className="mx-auto max-w-lg space-y-6 px-4">
				{/* Back Link */}
				<div>
					<Link
						to={`/events/${id}`}
						className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
					>
						<ArrowLeft className="h-3.5 w-3.5" />
						<span>Back to event details</span>
					</Link>
				</div>

				{/* Header Title */}
				<div className="space-y-1">
					<h1 className="font-bold text-2xl text-zinc-100 tracking-tight sm:text-3xl">
						Apply for {event.title}
					</h1>
					<p className="text-sm text-zinc-400">
						Fill in your details below to register for this event.
					</p>
				</div>

				{/* Registration Form */}
				<div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
					<RegistrationForm
						event={event}
						user={user}
						onSuccessRedirect="/dashboard"
					/>
				</div>
			</div>
		</PageWrapper>
	);
}
