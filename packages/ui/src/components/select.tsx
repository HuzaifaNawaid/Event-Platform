import { cn } from "@aws-platform/ui/lib/utils";
import * as React from "react";

export interface SelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div className="relative">
				<select
					ref={ref}
					data-slot="select"
					className={cn(
						"h-9 w-full cursor-pointer appearance-none rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 pr-8 text-sm text-zinc-100 transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF9900] disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				>
					{children}
				</select>
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
					<svg
						className="h-4 w-4 fill-current"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
					</svg>
				</div>
			</div>
		);
	},
);
Select.displayName = "Select";

export { Select };
