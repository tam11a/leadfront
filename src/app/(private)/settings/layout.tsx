import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./sidebar-nav";

const sidebarNavItems = [
	{
		title: "Profile",
		href: "/settings",
	},
	{
		title: "Security",
		href: "/settings/security",
	},
	{
		title: "Appearance",
		href: "/settings/appearance",
	},
];

export default function SettingsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="space-y-6 block">
			<div className="space-y-0.5 p-6 pb-1">
				<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
				<p className="text-muted-foreground text-sm">
					Manage your account settings and set e-mail preferences.
				</p>
			</div>
			<Separator />
			<div className="flex flex-col space-y-6 lg:flex-row lg:space-x-8 lg:space-y-0 px-6">
				<aside className="lg:w-1/5">
					<SidebarNav items={sidebarNavItems} />
				</aside>
				<div className="flex-1 lg:max-w-2xl">{children}</div>
			</div>
		</div>
	);
}
