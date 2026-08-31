import { cn } from "@aws-platform/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const badgeVariants = cva(
	"inline-flex select-none items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
	{
		variants: {
			variant: {
				default: "border-zinc-700 bg-zinc-800 text-zinc-300",
				secondary:
					"border-transparent bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
				active: "border-[#FF9900]/40 bg-[#FF9900]/10 text-[#FF9900]",
				upcoming: "border-zinc-700 bg-zinc-800 text-zinc-300",
				closed: "border-zinc-800 bg-zinc-800/40 text-zinc-500",
				outline: "border-zinc-700 text-zinc-300",
				destructive: "border-red-900/50 bg-red-950/30 text-red-400",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
