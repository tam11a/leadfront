"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Contexts({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// ✅ this is stable
	const [query] = useState(() => new QueryClient());

	return <QueryClientProvider client={query}>{children}</QueryClientProvider>;
}
