import { Button } from "@aws-platform/ui/components/button";
import { Card } from "@aws-platform/ui/components/card";
import { Calendar, Tag } from "lucide-react";
import { Link } from "react-router";

export interface EventCardProps {
	id: string;
	title: string;
	description: string;
	date: string | Date;
	eventType?: string;
	fee?: number | null;
	status?: "upcoming" | "active" | "closed" | string;
	accountNumber?: string;
}

export function formatDate(dateInput: string | Date): string {
	try {
		const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
		if (Number.isNaN(d.getTime())) return String(dateInput);
		return d.toLocaleDateString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	} catch {
		return String(dateInput);
	}
}

export default function EventCard({
	id,
	title,
	description,
	date,
	eventType = "Event",
	fee = null,
	status = "upcoming",
}: EventCardProps) {
	const formattedDate = formatDate(date);

	const getStatusBadge = () => {
		switch (status?.toLowerCase()) {
			case "active":
				return (
					<span className="rounded-md border border-[#FF9900]/40 bg-[#FF9900]/10 px-2 py-0.5 font-medium text-[#FF9900] text-xs">
						Active
					</span>
				);
			case "closed":
				return (
					<span className="rounded-md border border-zinc-800 bg-zinc-800/40 px-2 py-0.5 font-medium text-xs text-zinc-500">
						Closed
					</span>
				);
			default:
				return (
					<span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-medium text-xs text-zinc-300">
						Upcoming
					</span>
				);
		}
	};

	return (
		<Card className="flex h-full flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-600">
			<div>
				{/* Top Badges Row */}
				<div className="mb-3 flex items-center justify-between gap-2">
					<span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
						<Tag className="h-3 w-3" />
						{eventType}
					</span>
					{getStatusBadge()}
				</div>

				{/* Title */}
				<h3 className="line-clamp-2 font-semibold text-lg text-zinc-100 tracking-tight">
					{title}
				</h3>

				{/* Description */}
				<p className="mt-2 line-clamp-3 text-sm text-zinc-400 leading-relaxed">
					{description}
				</p>
			</div>

			<div className="mt-5 space-y-4 border-zinc-800/80 border-t pt-4">
				{/* Date and Fee Row */}
				<div className="flex items-center justify-between text-xs">
					<div className="flex items-center gap-1.5 text-zinc-400">
						<Calendar className="h-3.5 w-3.5" />
						<span>{formattedDate}</span>
					</div>
					<div className="font-medium text-zinc-100">
						{fee === null || fee === 0 ? "Free" : `Rs. ${fee}`}
					</div>
				</div>

				{/* CTA Button */}
				<Link to={`/events/${id}`} className="block w-full">
					<Button
						variant="outline"
						className="w-full border-zinc-700 bg-zinc-800 text-zinc-100 hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
					>
						View Event
					</Button>
				</Link>
			</div>
		</Card>
	);
}
