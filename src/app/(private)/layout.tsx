import { ModeToggle } from "@/components/ui/mode-toggle";
import ResizableSidebar from "./resizable-sidebar";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export default function PrivateLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Check if the user is logged in
	const token = cookies().get("access_token")?.value;
	if (!token) {
		redirect("/", RedirectType.replace);
	}

	const layout = cookies().get("react-resizable-panels:layout");
	const collapsed = cookies().get("react-resizable-panels:collapsed");

	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
	return (
		<>
			<ResizableSidebar
				defaultLayout={defaultLayout}
				defaultCollapsed={defaultCollapsed}
				navCollapsedSize={3}
			>
				<main
				// vaul-drawer-wrapper="" // Needed for the drawer to work with scale animation
				>
					{children}
				</main>
				<div className="fixed bottom-5 right-5 hidden lg:inline">
					<ModeToggle />
				</div>
			</ResizableSidebar>
		</>
	);
}
