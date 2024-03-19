"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export default function TabNav() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<Tabs
			className="mb-4"
			value={pathname.split("/")?.[3] || ""}
			onValueChange={(value) => {
				router.push(`/customers/${pathname.split("/")?.[2]}/${value}`);
			}}
		>
			<TabsList>
				<TabsTrigger value="">Details</TabsTrigger>
				<TabsTrigger value="interests">Interests</TabsTrigger>
				<TabsTrigger value="logs">Logs</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
