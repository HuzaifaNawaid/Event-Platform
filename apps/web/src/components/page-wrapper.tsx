import type * as React from "react";
import Nav from "./nav";

export interface PageWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export default function PageWrapper({
	children,
	className = "",
}: PageWrapperProps) {
	return (
		<div className="flex min-h-screen flex-col bg-black text-zinc-100 antialiased">
			<Nav />
			<main className={`flex-1 ${className}`}>{children}</main>
			<footer className="border-zinc-900 border-t py-6 text-center text-xs text-zinc-600">
				<div className="mx-auto max-w-5xl px-4">
					<p>
						© {new Date().getFullYear()} AWS Cloud Club & DevSoc Events
						Platform. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
