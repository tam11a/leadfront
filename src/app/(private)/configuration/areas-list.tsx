"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAreas } from "@/lib/actions/configuration/areas/get-areas";
import moment from "moment";

// Icons
import { MdOutlineDelete } from "react-icons/md";
import { CreateSheet } from "./create-area";
import { UpdateSheet } from "./update-area";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessAreasList() {
	const [search, setSearch] = useState("");
	const { data, isLoading, isError, error } = useGetAreas(search);

	if (isError) throw new Error(error.message);

	return (
		<>
			<div className="flex flex-row items-center max-w-md gap-3">
				<Input
					placeholder="Filter area..."
					className="flex-1"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<CreateSheet />
			</div>
			<div className="max-w-xl space-y-3">
				{isLoading ? (
					<>
						<Skeleton className="h-24 w-full rounded-2xl" />
						<Skeleton className="h-24 w-full rounded-2xl" />
						<Skeleton className="h-24 w-full rounded-2xl" />
						<Skeleton className="h-24 w-full rounded-2xl" />
					</>
				) : (
					<>
						{data?.data.map((area: any) => (
							<AreaCard
								area={area}
								key={area.id}
							/>
						))}
					</>
				)}
			</div>
		</>
	);
}

function AreaCard({ area }: { area: any }) {
	const [open, setOpen] = useState(false);
	return (
		<Card
			key={area.id}
			className="flex flex-row gap-3 items-center "
		>
			<CardHeader className="flex-1">
				<CardTitle>
					{/* <span className="text-primary mr-1">{area.id}.</span> */}
					{area.area_name}
				</CardTitle>
				<CardDescription className="text-xs">
					Last Updated{" "}
					<span className="text-primary mr-1">
						{moment(area.updated_at).format("ll")}
					</span>
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex flex-row items-center gap-1 p-6">
				<UpdateSheet
					open={open}
					setOpen={setOpen}
					old_data={area}
				/>
				<Button
					variant={"outline"}
					size={"icon"}
					className="text-destructive"
				>
					<MdOutlineDelete />
				</Button>
			</CardFooter>
		</Card>
	);
}
