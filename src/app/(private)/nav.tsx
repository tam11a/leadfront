"use client";

import { buttonVariants } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps {
	isCollapsed: boolean;
	links: {
		title: string;
		label?: string;
		icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		variant?:
			| "default"
			| "destructive"
			| "outline"
			| "secondary"
			| "ghost"
			| "link";
		href?: string;
		replace?: boolean;
	}[];
}

export function Nav({ links, isCollapsed }: NavProps) {
	const pathname = usePathname();
	return (
		<div
			data-collapsed={isCollapsed}
			className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
		>
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map((link, index) =>
					isCollapsed ? (
						<Tooltip
							key={index}
							delayDuration={0}
						>
							<TooltipTrigger asChild>
								<Link
									href={`/${link.href}`}
									className={cn(
										buttonVariants({
											variant:
												link.variant ||
												(pathname?.split("/")[1] === link.href
													? "default"
													: "ghost"),
											size: "icon",
										}),
										"h-9 w-9"
										// link.variant === "default" &&
										// 	"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
									)}
								>
									<link.icon className="h-5 w-5" />
									<span className="sr-only">{link.title}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent
								side="right"
								className="flex items-center gap-4"
							>
								{link.title}
								{link.label && (
									<span className="ml-auto text-muted-foreground">
										{link.label}
									</span>
								)}
							</TooltipContent>
						</Tooltip>
					) : (
						<Link
							key={index}
							href={`/${link.href}`}
							className={cn(
								buttonVariants({
									variant:
										link.variant ||
										(pathname?.split("/")[1] === link.href
											? "default"
											: "ghost"),
									size: "default",
								}),
								// link.variant === "default" &&
								// 	"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
								"justify-start"
							)}
						>
							<link.icon className="mr-3 h-5 w-5" />
							{link.title}
							{link.label && (
								<span
									className={cn(
										"ml-auto",
										link.variant === "default" &&
											"text-background dark:text-white"
									)}
								>
									{link.label}
								</span>
							)}
						</Link>
					)
				)}
			</nav>
		</div>
	);
}
