import { Button } from "@aws-platform/ui/components/button";
import { Link, NavLink } from "react-router";

import { authClient } from "@/lib/auth-client";
import UserMenu from "./user-menu";

export const PLATFORM_NAME = "DevSoc Events";

export default function Nav() {
	// TODO: [AUTH - Samar/Sameer] — verify authClient.useSession integration with session state
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;

	const navLinks = [
		{ to: "/", label: "Events" },
		...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
	];

	return (
		<header className="sticky top-0 z-50 h-16 w-full border-zinc-800 border-b bg-black">
			<div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
				{/* Brand / Logo */}
				<div className="flex items-center gap-8">
					<Link
						to="/"
						className="flex items-center gap-2 font-bold text-lg text-zinc-100 tracking-tight transition-colors hover:text-white"
					>
						<span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FF9900] font-extrabold text-black text-sm">
							AWS
						</span>
						<span>{PLATFORM_NAME}</span>
					</Link>

					{/* Navigation Links */}
					<nav className="hidden items-center gap-6 text-sm sm:flex">
						{navLinks.map(({ to, label }) => (
							<NavLink
								key={to}
								to={to}
								end={to === "/"}
								className={({ isActive }) =>
									`relative py-5 transition-colors ${
										isActive
											? "font-medium text-zinc-100 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#FF9900]"
											: "text-zinc-400 hover:text-zinc-200"
									}`
								}
							>
								{label}
							</NavLink>
						))}
					</nav>
				</div>

				{/* Right side Auth */}
				<div className="flex items-center gap-3">
					{isPending ? (
						<div className="h-8 w-20 animate-pulse rounded-md bg-zinc-800" />
					) : user ? (
						<div className="flex items-center gap-3">
							<Link
								to="/dashboard"
								className="hidden text-sm text-zinc-400 transition-colors hover:text-zinc-100 sm:inline-block"
							>
								{user.email}
							</Link>
							<UserMenu />
						</div>
					) : (
						<Link to="/login">
							<Button
								variant="outline"
								className="border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:text-white"
							>
								Sign In
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
