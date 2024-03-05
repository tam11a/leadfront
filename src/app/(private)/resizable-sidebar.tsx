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
import { Separator } from "@/components/ui/separator";

// Icons
import { MdOutlineDashboard } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbBuildingCommunity } from "react-icons/tb";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { IoIdCardOutline } from "react-icons/io5";
import { MdKey } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { TbLogout } from "react-icons/tb";

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
					minSize={10}
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
							"min-w-[30px] transition-all duration-300 ease-in-out"
					)}
				>
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Dashboard",
								icon: MdOutlineDashboard,
								variant: "default",
								href: "/dashboard",
							},
						]}
					/>
					<Separator />
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Customers",
								icon: FaPeopleGroup,
								variant: "ghost",
								href: "/customers",
							},
							{
								title: "Properties",
								icon: TbBuildingCommunity,
								variant: "ghost",
								href: "/customers",
							},
							{
								title: "Media",
								icon: MdOutlineConnectWithoutContact,
								variant: "ghost",
								href: "/customers",
							},
						]}
					/>
					<Separator />
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Employees",
								icon: IoIdCardOutline,
								variant: "ghost",
								href: "/customers",
							},
							{
								title: "Roles & Permissions",
								icon: MdKey,
								variant: "ghost",
								href: "/customers",
							},
						]}
					/>
					<Separator />
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Settings",
								icon: MdOutlineSettings,
								variant: "ghost",
								href: "/customers",
							},
							{
								title: "Logout",
								icon: TbLogout,
								variant: "ghost",
								href: "/customers",
							},
						]}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel
					className="p-6 h-screen !overflow-y-auto"
					defaultSize={defaultLayout[1]}
					minSize={30}
				>
					{children}
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
