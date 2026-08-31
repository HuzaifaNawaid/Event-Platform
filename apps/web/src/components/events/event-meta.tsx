import { Building, Calendar, CreditCard, MapPin, Tag } from "lucide-react";
import { formatDate } from "./event-card";

export interface EventMetaProps {
	date: string | Date;
	eventType?: string;
	status?: "upcoming" | "active" | "closed" | string;
	fee?: number | null;
	venue?: string;
	location?: string;
	accountNumber?: string;
	className?: string;
}

export default function EventMeta({
	date,
	eventType = "Event",
	status = "upcoming",
	fee = null,
	venue,
	location,
	accountNumber,
	className = "",
}: EventMetaProps) {
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
		<div className={`space-y-4 ${className}`}>
			{/* Badges */}
			<div className="flex flex-wrap items-center gap-2">
				<span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
					<Tag className="h-3.5 w-3.5 text-zinc-400" />
					{eventType}
				</span>
				{getStatusBadge()}
			</div>

			{/* Meta items grid */}
			<div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div className="flex items-center gap-2 text-zinc-300">
					<Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
					<span>{formattedDate}</span>
				</div>

				<div className="flex items-center gap-2 text-zinc-300">
					<CreditCard className="h-4 w-4 shrink-0 text-zinc-400" />
					<span>
						Fee:{" "}
						<span className="font-semibold text-zinc-100">
							{fee === null || fee === 0 ? "Free" : `Rs. ${fee}`}
						</span>
					</span>
				</div>

				{(venue || location) && (
					<div className="flex items-center gap-2 text-zinc-300">
						<MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
						<span>{venue || location}</span>
					</div>
				)}

				{accountNumber && (
					<div className="flex items-center gap-2 text-zinc-300">
						<Building className="h-4 w-4 shrink-0 text-zinc-400" />
						<span>
							Account:{" "}
							<span className="font-mono text-zinc-200">{accountNumber}</span>
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
