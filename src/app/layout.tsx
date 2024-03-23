import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/provider";
import Contexts from "./context";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Toasts
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Last Wave | Your Lead Generation Partner",
	description: "We help you generate leads and grow your business.",
	icons: "/favicon.svg",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(outfit.className, "bg-background")}
				suppressHydrationWarning
			>
				<CookiesProvider>
					<Contexts>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
							<Sonner /> {/* Toasts */}
							<Toaster />
						</ThemeProvider>
					</Contexts>
				</CookiesProvider>
			</body>
		</html>
	);
}
