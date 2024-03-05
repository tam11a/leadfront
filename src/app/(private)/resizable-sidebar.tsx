"use client";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Nav } from "./nav";
import { MdOutlineDashboard } from "react-icons/md";

export default function ResizableSidebar({
	children,
	defaultLayout = [265, 440, 655],
	defaultCollapsed = false,
	navCollapsedSize,
}: Readonly<{
	children: React.ReactNode;
	defaultLayout: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
}>) {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={(sizes: number[]) => {
					document.cookie = `react-resizable-panels:layout=${JSON.stringify(
						sizes
					)}`;
				}}
				className="h-full min-h-screen"
			>
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={navCollapsedSize}
					collapsible={true}
					minSize={15}
					maxSize={20}
					onCollapse={() => {
						setIsCollapsed(true);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							true
						)}`;
					}}
					onExpand={() => {
						setIsCollapsed(false);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							false
						)}`;
					}}
					className={cn(
						isCollapsed &&
							"min-w-[50px] transition-all duration-300 ease-in-out"
					)}
				>
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Dashboard",
								label: "128",
								icon: MdOutlineDashboard,
								variant: "default",
								href: "/dashboard",
							},
						]}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel
					className="p-6"
					defaultSize={defaultLayout[1]}
					minSize={30}
				>
					{children}
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
