import { ModeToggle } from "@/components/ui/mode-toggle";

export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<div className="fixed bottom-5 right-5">
				<ModeToggle />
			</div>
		</>
	);
}
