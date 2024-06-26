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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

// Icons
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { MdOutlineDashboard } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbBuildingCommunity } from "react-icons/tb";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { IoIdCardOutline } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import { MdDisplaySettings } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";

export default function ResizableSidebar({
	children,
	defaultLayout = [20, 80, 100],
	defaultCollapsed = false,
	navCollapsedSize,
}: Readonly<{
	children: React.ReactNode;
	defaultLayout: number[] | undefined;
	defaultCollapsed?: boolean;
	navCollapsedSize: number;
}>) {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
	const [open, setOpen] = useState(false);

	function NavBar({ collapsed = false }: Readonly<{ collapsed?: boolean }>) {
		return (
			<>
				<Nav
					isCollapsed={collapsed}
					onClick={() => setOpen(false)}
					links={[
						{
							title: "Dashboard",
							icon: MdOutlineDashboard,
							href: "dashboard",
							prefetch: true,
						},
					]}
				/>
				<Separator />
				<Nav
					isCollapsed={collapsed}
					onClick={() => setOpen(false)}
					links={[
						{
							title: "Customers",
							icon: FaPeopleGroup,
							href: "customers",
							prefetch: true,
						},
						{
							title: "Properties",
							icon: TbBuildingCommunity,
							href: "properties",
							prefetch: true,
						},
						{
							title: "Media",
							icon: MdOutlineConnectWithoutContact,
							href: "medias",
							prefetch: true,
						},
					]}
				/>
				<Separator />
				<Nav
					isCollapsed={collapsed}
					onClick={() => setOpen(false)}
					links={[
						{
							title: "Employees",
							icon: IoIdCardOutline,
							href: "employees",
							prefetch: true,
						},
					]}
				/>
				<Separator />
				<Nav
					onClick={() => setOpen(false)}
					isCollapsed={collapsed}
					links={[
						{
							title: "Configuration",
							icon: MdDisplaySettings,
							href: "configuration",
							prefetch: true,
						},
					]}
				/>
				<Separator />
				<Nav
					isCollapsed={collapsed}
					onClick={() => setOpen(false)}
					links={[
						{
							title: "Settings",
							icon: MdOutlineSettings,
							href: "settings",
							prefetch: true,
						},
						{
							title: "Logout",
							icon: PiSignOutBold,
							href: "logout",
							variant: "destructive",
							replace: true,
							prefetch: false,
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
						"hidden min-w-min lg:block"
					)}
				>
					<ScrollArea className="h-screen">
						<NavBar collapsed={isCollapsed} />
					</ScrollArea>
				</ResizablePanel>
				<ResizableHandle
					withHandle
					className="hidden lg:flex"
				/>
				<ResizablePanel
					defaultSize={defaultLayout[1]}
					minSize={30}
				>
					<ScrollArea className="h-screen">
						<header className="inline-flex lg:hidden flex-row items-center justify-between w-full px-4 pt-4 pb-1">
							<Drawer
								shouldScaleBackground
								open={open}
								onOpenChange={(o) => setOpen(o)}
							>
								<DrawerTrigger asChild>
									<Button
										variant="outline"
										size="icon"
									>
										<HamburgerMenuIcon />
									</Button>
								</DrawerTrigger>
								<DrawerContent>
									<DrawerClose asChild>
										<NavBar />
									</DrawerClose>
								</DrawerContent>
							</Drawer>
							<ModeToggle />
						</header>
						{children}
					</ScrollArea>
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>
	);
}
