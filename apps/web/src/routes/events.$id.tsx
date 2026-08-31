import { Button } from "@aws-platform/ui/components/button";
import { Card } from "@aws-platform/ui/components/card";
import { ArrowLeft, Lock, Share2 } from "lucide-react";
import * as React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import EventMeta from "@/components/events/event-meta";
import PageWrapper from "@/components/page-wrapper";
import { authClient } from "@/lib/auth-client";
import { MOCK_EVENTS } from "./_index";

export function meta({ params }: { params: { id?: string } }) {
	const event = MOCK_EVENTS.find((e) => e.id === params.id) || MOCK_EVENTS[0];
	return [
		{ title: `${event ? event.title : "Event Details"} | DevSoc Events` },
		{
			name: "description",
			content: event
				? event.description
				: "View event details and register online.",
		},
	];
}

export default function EventDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// TODO: [AUTH - Samar/Sameer] — authClient.useSession
	const { data: session, isPending: isAuthPending } = authClient.useSession();
	const user = session?.user;

	// TODO: [BACKEND - Waleed] — replace with real tRPC query: trpc.events.getById.useQuery({ id: id! })
	const event = React.useMemo(() => {
		return (
			MOCK_EVENTS.find((e) => e.id === id) ||
			(id === "1" ? MOCK_EVENTS[0] : null)
		);
	}, [id]);

	if (!event) {
		return (
			<PageWrapper className="py-16">
				<div className="mx-auto max-w-2xl px-4 text-center">
					<h2 className="font-bold text-2xl text-zinc-100">Event Not Found</h2>
					<p className="mt-2 text-sm text-zinc-400">
						The event you are looking for does not exist or has been removed.
					</p>
					<div className="mt-6">
						<Link to="/">
							<Button
								variant="outline"
								className="border-zinc-700 bg-zinc-800 text-zinc-200"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to all events
							</Button>
						</Link>
					</div>
				</div>
			</PageWrapper>
		);
	}

	const isClosed = event.status?.toLowerCase() === "closed";
	const feeDisplay =
		event.fee === null || event.fee === 0 ? "Free" : `Rs. ${event.fee}`;

	const handleRegister = () => {
		if (isClosed) return;

		const applyUrl = `/events/${id}/apply`;

		if (!user && !isAuthPending) {
			// Case B: User not logged in -> redirect to login with return destination
			navigate(`/login?redirect=${encodeURIComponent(applyUrl)}`);
		} else {
			// Case A: User logged in -> go straight to apply
			navigate(applyUrl);
		}
	};

	const handleShare = () => {
		if (typeof window !== "undefined" && navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href);
			toast.success("Event link copied to clipboard!");
		}
	};

	return (
		<PageWrapper className="py-10">
			<div className="mx-auto max-w-5xl space-y-8 px-4">
				{/* Back navigation */}
				<div>
					<Link
						to="/"
						className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Back to events</span>
					</Link>
				</div>

				{/* Main Grid Layout */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Left 2 Columns: Main Details */}
					<div className="space-y-8 lg:col-span-2">
						{/* Header section */}
						<div className="space-y-4">
							<EventMeta
								date={event.date}
								eventType={event.eventType}
								status={event.status}
								fee={event.fee}
								accountNumber={event.accountNumber}
							/>

							<h1 className="font-bold text-3xl text-zinc-100 leading-tight tracking-tight sm:text-4xl">
								{event.title}
							</h1>
						</div>

						{/* Description */}
						<div className="space-y-4 border-zinc-800 border-t pt-6">
							<h2 className="font-semibold text-lg text-zinc-100">
								About this Event
							</h2>
							<div className="max-w-2xl space-y-4 text-sm text-zinc-300 leading-relaxed sm:text-base">
								<p>{event.description}</p>
								<p>
									Join fellow students, developers, and cloud architects in this
									interactive session. Whether you are just getting started with
									cloud computing or looking to master advanced architectures,
									this event offers actionable knowledge, networking, and
									hands-on experience.
								</p>
								<div className="mt-4 space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
									<h3 className="font-medium text-sm text-zinc-200">
										What to bring:
									</h3>
									<ul className="list-inside list-disc space-y-1 text-xs text-zinc-400">
										<li>Your laptop and charger</li>
										<li>Active AWS account (Free Tier is sufficient)</li>
										<li>University Student ID card for entry verification</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* Right 1 Column: Registration Panel */}
					<div className="space-y-4">
						<Card className="sticky top-24 space-y-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
							<div>
								<span className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">
									Registration
								</span>
								<div className="mt-2 flex items-baseline justify-between">
									<span className="font-bold text-2xl text-zinc-100">
										{feeDisplay}
									</span>
									<span className="text-xs text-zinc-400">
										{event.fee ? "per participant" : "Open access"}
									</span>
								</div>
							</div>

							<div className="space-y-3 border-zinc-800 border-y py-4 text-xs text-zinc-300">
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Status</span>
									<span className="font-medium text-zinc-200 capitalize">
										{event.status}
									</span>
								</div>
								{event.accountNumber && (
									<div className="flex items-center justify-between">
										<span className="text-zinc-400">Payment Via</span>
										<span className="font-mono text-zinc-200">
											Bank Transfer
										</span>
									</div>
								)}
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Certificate</span>
									<span className="text-zinc-200">
										Provided upon completion
									</span>
								</div>
							</div>

							{/* Registration CTA Button */}
							{isClosed ? (
								<Button
									disabled
									className="h-11 w-full cursor-not-allowed bg-zinc-800 font-medium text-zinc-500"
								>
									<Lock className="mr-2 h-4 w-4" />
									Registration Closed
								</Button>
							) : (
								<Button
									onClick={handleRegister}
									className="h-11 w-full cursor-pointer rounded-md bg-[#FF9900] font-semibold text-black text-sm shadow-none transition-colors hover:bg-[#cc7a00]"
								>
									Register Now
								</Button>
							)}

							<Button
								variant="outline"
								size="sm"
								onClick={handleShare}
								className="w-full border-zinc-700 bg-zinc-800/80 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
							>
								<Share2 className="mr-2 h-3.5 w-3.5" />
								Share Event
							</Button>
						</Card>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
}
