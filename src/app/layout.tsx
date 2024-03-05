import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/provider";

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
			<body className={cn(outfit.className, "bg-background")}>
				<CookiesProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</CookiesProvider>
			</body>
		</html>
	);
}
