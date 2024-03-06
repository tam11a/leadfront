import { ModeToggle } from "@/components/ui/mode-toggle";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Check if the user is already logged in
	const token = cookies().get("access_token")?.value;
	if (token) {
		redirect("/dashboard", RedirectType.replace);
	}

	return (
		<>
			{children}
			<div className="fixed bottom-5 right-5">
				<ModeToggle />
			</div>
		</>
	);
}
