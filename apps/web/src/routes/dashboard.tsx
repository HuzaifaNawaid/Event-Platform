import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import PageWrapper from "@/components/page-wrapper";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function Dashboard() {
	const { data: session, isPending } = authClient.useSession();
	const navigate = useNavigate();

	const privateData = useQuery(trpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			navigate("/login");
		}
	}, [session, isPending, navigate]);

	if (isPending) {
		return (
			<PageWrapper className="py-20">
				<div className="mx-auto max-w-5xl px-4 text-center text-zinc-400">
					Loading dashboard...
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper className="py-10">
			<div className="mx-auto max-w-5xl space-y-6 px-4">
				<div className="border-zinc-800 border-b pb-4">
					<h1 className="font-bold text-2xl text-zinc-100">User Dashboard</h1>
					<p className="text-sm text-zinc-400">
						Welcome back, {session?.user.name || session?.user.email}
					</p>
				</div>

				<div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
					<h2 className="font-semibold text-lg text-zinc-200">
						Your Applications
					</h2>
					<p className="text-sm text-zinc-400">
						{privateData.data?.message
							? `API Status: ${privateData.data.message}`
							: "No pending applications to display."}
					</p>
				</div>
			</div>
		</PageWrapper>
	);
}
