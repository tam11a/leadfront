"use client";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 max-w-xs text-center mx-auto">
			<h1 className="text-7xl font-bold mb-6">404</h1>
			<CardTitle>Customer Not Found</CardTitle>
			<CardDescription>
				The customer you are looking for does not exist.
			</CardDescription>
			<Link href="/customers">
				<Button>View List</Button>
			</Link>
		</div>
	);
}
