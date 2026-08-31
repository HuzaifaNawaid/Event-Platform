import { Button } from "@aws-platform/ui/components/button";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import EventCard, { type EventCardProps } from "./event-card";

export interface EventsListProps {
	events: EventCardProps[];
	totalCount?: number;
	page: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	isLoading?: boolean;
	error?: Error | string | null;
	onRetry?: () => void;
}

export default function EventsList({
	events,
	totalCount,
	page,
	pageSize,
	onPageChange,
	isLoading = false,
	error = null,
	onRetry,
}: EventsListProps) {
	// Loading state with 6 skeleton cards
	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((key) => (
						<div
							key={key}
							className="flex h-64 animate-pulse flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 p-5"
						>
							<div className="space-y-3">
								<div className="flex justify-between">
									<div className="h-5 w-20 rounded bg-zinc-800" />
									<div className="h-5 w-16 rounded bg-zinc-800" />
								</div>
								<div className="mt-2 h-6 w-3/4 rounded bg-zinc-800" />
								<div className="mt-3 space-y-1.5">
									<div className="h-3.5 w-full rounded bg-zinc-800/80" />
									<div className="h-3.5 w-5/6 rounded bg-zinc-800/80" />
								</div>
							</div>
							<div className="space-y-3 border-zinc-800/60 border-t pt-4">
								<div className="flex justify-between">
									<div className="h-3.5 w-24 rounded bg-zinc-800" />
									<div className="h-3.5 w-12 rounded bg-zinc-800" />
								</div>
								<div className="h-8 w-full rounded bg-zinc-800" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="my-8 rounded-lg border border-zinc-800 bg-zinc-900/40 p-12 text-center">
				<p className="mb-1 font-medium text-zinc-300">Unable to load events.</p>
				<p className="mb-4 text-xs text-zinc-500">
					{typeof error === "string"
						? error
						: error.message ||
							"An unexpected error occurred while fetching events."}
				</p>
				{onRetry && (
					<Button
						variant="outline"
						onClick={onRetry}
						className="inline-flex items-center gap-2 border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
					>
						<RefreshCw className="h-3.5 w-3.5" />
						Try again
					</Button>
				)}
			</div>
		);
	}

	// Empty state
	if (!events || events.length === 0) {
		return (
			<div className="my-8 rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-12 text-center">
				<p className="font-medium text-base text-zinc-300">
					No upcoming events yet
				</p>
				<p className="mt-1 text-sm text-zinc-500">
					Check back soon for new hackathons, workshops, and meetups.
				</p>
			</div>
		);
	}

	const effectiveTotal = totalCount ?? events.length;
	const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize));
	const isFirstPage = page <= 1;
	const isLastPage = page >= totalPages;

	return (
		<div className="space-y-8">
			{/* Events Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{events.map((event) => (
					<EventCard key={event.id} {...event} />
				))}
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-4 border-zinc-800/80 border-t pt-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange?.(page - 1)}
						disabled={isFirstPage}
						className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
					>
						<ChevronLeft className="mr-1 h-4 w-4" />
						Previous
					</Button>

					<span className="font-medium text-xs text-zinc-400">
						Page {page} of {totalPages}
					</span>

					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange?.(page + 1)}
						disabled={isLastPage}
						className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40"
					>
						Next
						<ChevronRight className="ml-1 h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
}
