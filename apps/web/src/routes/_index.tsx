import * as React from "react";
import type { EventCardProps } from "@/components/events/event-card";
import EventsList from "@/components/events/events-list";
import PageWrapper from "@/components/page-wrapper";

// TODO: [BACKEND - Waleed] — replace MOCK_EVENTS with real tRPC query: trpc.events.list.useQuery({ page, pageSize: 6 })
export const MOCK_EVENTS: EventCardProps[] = [
	{
		id: "1",
		title: "AWS AI & Cloud Hackathon 2025",
		description:
			"48-hour intense hackathon focused on building scalable, AI-powered cloud applications on AWS. Open to all university students.",
		date: "2025-03-15T09:00:00Z",
		eventType: "Hackathon",
		fee: 500,
		status: "active",
		accountNumber: "PK70-MEZN-0001-2345-6789-01",
	},
	{
		id: "2",
		title: "Serverless Architectures with AWS Lambda",
		description:
			"Hands-on workshop exploring event-driven microservices with AWS Lambda, API Gateway, and DynamoDB.",
		date: "2025-03-22T14:00:00Z",
		eventType: "Workshop",
		fee: null,
		status: "upcoming",
		accountNumber: "PK70-MEZN-0001-2345-6789-01",
	},
	{
		id: "3",
		title: "Cloud Security & DevSecOps Summit",
		description:
			"Deep dive into IAM policies, least privilege, zero-trust security postures, and automated compliance pipelines.",
		date: "2025-03-29T10:00:00Z",
		eventType: "Tech Talk",
		fee: 250,
		status: "upcoming",
		accountNumber: "PK70-MEZN-0001-2345-6789-01",
	},
	{
		id: "4",
		title: "Modern Web Dev with React & Cloudflare/AWS",
		description:
			"Master high-performance full-stack applications with React 19, TypeScript, edge caching, and serverless backends.",
		date: "2025-04-05T11:00:00Z",
		eventType: "Workshop",
		fee: null,
		status: "upcoming",
		accountNumber: "PK70-MEZN-0001-2345-6789-01",
	},
	{
		id: "5",
		title: "Generative AI on AWS Bedrock",
		description:
			"Learn how to build RAG pipelines, fine-tune models, and deploy production-ready AI agents using Amazon Bedrock.",
		date: "2025-04-12T15:00:00Z",
		eventType: "Masterclass",
		fee: 750,
		status: "upcoming",
		accountNumber: "PK70-MEZN-0001-2345-6789-01",
	},
	{
		id: "6",
		title: "DevOps & Kubernetes Bootcamp",
		description:
			"Container orchestration from scratch using Amazon EKS, Helm charts, and GitOps delivery patterns.",
		date: "2025-04-19T09:00:00Z",
		eventType: "Bootcamp",
		fee: 1000,
		status: "closed",
		accountNumber: "PK70-MEZN-0001-2345-6789-01",
	},
];

export function meta() {
	return [
		{ title: "DevSoc Events | AWS Cloud Club" },
		{
			name: "description",
			content:
				"Explore and register for upcoming AWS Cloud Club & DevSoc workshops, hackathons, and conferences.",
		},
	];
}

export default function Home() {
	const [page, setPage] = React.useState(1);
	const pageSize = 6;

	// Pagination calculation
	const startIndex = (page - 1) * pageSize;
	const paginatedEvents = MOCK_EVENTS.slice(startIndex, startIndex + pageSize);

	return (
		<PageWrapper className="py-10">
			<div className="mx-auto max-w-5xl space-y-12 px-4">
				{/* Hero Section */}
				<section className="space-y-3">
					<div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">
						<span className="h-2 w-2 rounded-full bg-[#FF9900]" />
						AWS Cloud Club × DevSoc
					</div>
					<h1 className="font-bold text-4xl text-zinc-100 leading-tight tracking-tight sm:text-5xl">
						Events for builders,
						<br />
						by builders.
					</h1>
					<p className="max-w-lg text-base text-zinc-400 leading-relaxed">
						Discover hackathons, hands-on workshops, and tech talks designed to
						elevate your engineering skills.
					</p>
				</section>

				{/* Events Section */}
				<section className="space-y-6">
					<div className="flex items-center justify-between border-zinc-800 border-b pb-4">
						<div>
							<h2 className="font-semibold text-xl text-zinc-100">
								Upcoming Events
							</h2>
							<p className="mt-0.5 text-xs text-zinc-400">
								Browse active and upcoming sessions
							</p>
						</div>
						<span className="font-mono text-xs text-zinc-400">
							{MOCK_EVENTS.length} events
						</span>
					</div>

					<EventsList
						events={paginatedEvents}
						totalCount={MOCK_EVENTS.length}
						page={page}
						pageSize={pageSize}
						onPageChange={setPage}
					/>
				</section>
			</div>
		</PageWrapper>
	);
}
