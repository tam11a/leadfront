"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import moment from "moment";
import { MdOutlineEdit } from "react-icons/md";

export function UpdateSheet({ data }: { data: any }) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant={"outline"}
					size={"icon"}
				>
					<MdOutlineEdit />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Update Business Area</SheetTitle>
					<SheetDescription>
						Complete the form below to update business area.
					</SheetDescription>
				</SheetHeader>
				<Separator className="mb-3 mt-5" />
				<Label
					htmlFor="name"
					className="text-right"
				>
					Area Name
				</Label>
				<Input
					id="name"
					value={data.area_name}
					readOnly
					placeholder="Dhaka, Chittagong, etc."
					className="my-3"
				/>
				<p className="text-right my-1 text-xs text-muted-foreground">
					Created: {moment(data.created_at).format("ll")}
				</p>
				<p className="text-right my-1 mb-3 text-xs text-muted-foreground">
					Last Updated: {moment(data.updated_at).format("ll")}
				</p>

				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
