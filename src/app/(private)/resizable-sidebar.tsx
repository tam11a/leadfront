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
import { MdDisplaySettings } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";

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

	function NavBar() {
		return (
			<>
				<Nav
					isCollapsed={isCollapsed}
					links={[
						{
							title: "Dashboard",
							icon: MdOutlineDashboard,
							href: "dashboard",
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
							href: "customers",
						},
						{
							title: "Properties",
							icon: TbBuildingCommunity,
							href: "customers",
						},
						{
							title: "Media",
							icon: MdOutlineConnectWithoutContact,
							href: "customers",
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
							href: "customers",
						},
						{
							title: "Roles & Permissions",
							icon: MdKey,
							href: "customers",
						},
					]}
				/>
				<Separator />
				<Nav
					isCollapsed={isCollapsed}
					links={[
						{
							title: "Configuration",
							icon: MdDisplaySettings,
							href: "configuration",
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
							href: "settings",
						},
					]}
				/>
			</>
		);
	}

	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={(sizes: number[]) => {
					document.cookie = `react-resizable-panels:layout=${JSON.stringify(
						sizes
					)}`;
				}}
				className="h-full min-h-screen overflow-hidden"
			>
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={navCollapsedSize}
					collapsible={true}
					minSize={13}
					maxSize={22}
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
							"min-w-[50px] transition-all duration-300 ease-in-out",
						"hidden md:block"
					)}
				>
					<ScrollArea className="h-screen">
						<NavBar />
					</ScrollArea>
				</ResizablePanel>
				<ResizableHandle
					withHandle
					className="hidden md:flex"
				/>
				<ResizablePanel
					defaultSize={defaultLayout[1]}
					minSize={30}
				>
					<ScrollArea className="h-screen">{children}</ScrollArea>
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
