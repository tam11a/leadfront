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
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

export default function BusinessAreasList() {
	const { data, isLoading, isError, error } = useGetAreas();

	if (isError) throw new Error(error.message);

	return (
		<>
			<div className="flex flex-row items-center max-w-md gap-3">
				<Input
					placeholder="Filter area..."
					className="flex-1"
				/>
				<Button>Add New</Button>
			</div>
			<div className="max-w-md space-y-3">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					<>
						{data?.data.map((area: any) => (
							<Card
								key={area.id}
								className="flex flex-row gap-3 items-center "
							>
								<CardHeader className="flex-1">
									<CardTitle>{area.area_name}</CardTitle>
									<CardDescription className="text-xs">
										Created {moment(area.created_at).format("ll")}
									</CardDescription>
								</CardHeader>
								<CardFooter className="flex flex-row items-center gap-1">
									<Button
										variant={"outline"}
										size={"icon"}
									>
										<MdOutlineEdit />
									</Button>
									<Button
										variant={"outline"}
										size={"icon"}
									>
										<MdOutlineDelete />
									</Button>
								</CardFooter>
							</Card>
						))}
					</>
				)}
			</div>
		</>
	);
}
