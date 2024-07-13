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
import { useGetPropertyUnits } from "@/lib/actions/configuration/property-units/get-property-units";
import moment from "moment";
import { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { CreateSheet } from "./create-units";
import { UpdateSheet } from "./update-units";
import { useDeletPropertyUnits } from "@/lib/actions/configuration/property-units/delete-property-units";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";

export default function PropertyUnitsList() {
	const [search, setSearch] = useState("");
	const { data, isLoading, isError, error } = useGetPropertyUnits();

	if (isError) throw new Error(error.message);
	return (
		<>
			<div className="flex flex-row items-center max-w-md gap-3">
				<Input
					placeholder="Filter measurement  unit..."
					className="flex-1"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<CreateSheet />
			</div>
			<div className="max-w-xl space-y-3">
				{data?.data.map((unit: any) => (
					<UnitCard
						unit={unit}
						key={unit.id}
					/>
				))}
			</div>
		</>
	);
}

function UnitCard({ unit }: { unit: any }) {
	const [open, setOpen] = useState(false);

	const { mutateAsync: deleteAsync, isPending } = useDeletPropertyUnits();

	async function onSubmit() {
		const res = await handleResponse(() => deleteAsync(unit.id), [204]);
		if (res.status) {
			toast("Deleted!", {
				description: `Measurement unit has been deleted successfully.`,
				important: true,
			});
		} else {
			toast("Error!", {
				description: `There was an error deleting measurement unit. Please try again.`,
				important: true,
				action: {
					label: "Retry",
					onClick: () => onSubmit(),
				},
			});
		}
	}
	return (
		<Card
			key={unit.id}
			className="flex flex-row gap-3 items-center"
		>
			<CardHeader className="flex-1">
				<CardTitle>{unit.unit_name}</CardTitle>
				<CardDescription className="text-xs">
					Last Updated{" "}
					<span className="text-primary mr-1">
						{moment(unit.updated_at).format("ll")}
					</span>
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex flex-row items-center gap-1 p-6">
				{!isPending && (
					<UpdateSheet
						open={open}
						setOpen={setOpen}
						old_data={unit}
					/>
				)}
				<Button
					variant={"outline"}
					size={"icon"}
					className="text-destructive"
					onClick={onSubmit}
					disabled={isPending}
				>
					<MdOutlineDelete />
				</Button>
			</CardFooter>
		</Card>
	);
}
