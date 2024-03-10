"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 max-w-xs text-center mx-auto">
			<h1 className="text-7xl font-bold mb-6">500</h1>
			<CardTitle>Something Went Wrong!</CardTitle>
			<CardDescription>
				Attempt to recover by trying again. If the problem persists, please
				contact support.
			</CardDescription>
			<Button>Try Again</Button>
		</div>
	);
}
