import { ModeToggle } from "@/components/ui/mode-toggle";
import ResizableSidebar from "./resizable-sidebar";
import { cookies } from "next/headers";

export default function PrivateLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
				{children}
				<div className="fixed bottom-5 right-5">
					<ModeToggle />
				</div>
			</ResizableSidebar>
		</>
	);
}
