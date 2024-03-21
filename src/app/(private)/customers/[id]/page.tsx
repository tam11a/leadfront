"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	CardTitle,
	CardDescription,
	Card,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetInterests } from "@/lib/actions/interests/get-interests";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FiActivity } from "react-icons/fi";
import { RiDeleteBin2Fill } from "react-icons/ri";

export default function CustomerInterestsPage({
	params,
}: {
	params: {
		id: number;
	};
}) {
	const [search, setSearch] = useState("");
	const { data } = useGetInterests({
		id: params.id,
		varr: true,
	});

	return !data?.data?.length ? (
		<div className="flex flex-col w-full items-center justify-center min-h-[400px] gap-5">
			<FiActivity className="text-5xl mx-auto text-gray-400" />
			<CardDescription>No interest added yet.</CardDescription>
			<Button>Add Interest</Button>
		</div>
	) : (
		<div className="space-y-3 max-w-lg">
			<div className="flex flex-row items-center gap-3 justify-between">
				<Input
					placeholder="Search property name, area.."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-xs"
				/>
				<Button>Add New</Button>
			</div>
			{data?.data?.map((interest: any) => (
				<Card
					key={interest.id}
					className={cn(
						"flex flex-row justify-between",
						search &&
							!(
								interest.name.toLowerCase().includes(search.toLowerCase()) ||
								interest.area.toLowerCase().includes(search.toLowerCase())
							)
							? "hidden"
							: ""
					)}
				>
					<CardHeader>
						<CardTitle>
							<Link
								href={`/properties/${interest.id}`}
								className="text-primary hover:underline"
							>
								{interest.name}
							</Link>
						</CardTitle>
						<CardDescription>
							{interest.area}
							<Badge
								className="ml-2"
								variant={"outline"}
							>
								{interest.type}
							</Badge>
						</CardDescription>
					</CardHeader>
					<CardHeader>
						<Button
							size={"icon"}
							variant={"outline"}
						>
							<RiDeleteBin2Fill />
						</Button>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
