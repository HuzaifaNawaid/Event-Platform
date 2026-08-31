import { cn } from "@aws-platform/ui/lib/utils";
import type * as React from "react";

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: React.ComponentProps<"div"> & {
	orientation?: "horizontal" | "vertical";
	decorative?: boolean;
}) {
	return (
		<div
			role={decorative ? "none" : "separator"}
			{...(!decorative && { "aria-orientation": orientation })}
			data-slot="separator"
			className={cn(
				"shrink-0 bg-zinc-800",
				orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
