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

export function CreateSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Add New</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Create Business Area</SheetTitle>
					<SheetDescription>
						Complete the form below to create a new business area.
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
					placeholder="Dhaka, Chittagong, etc."
					className="my-3"
				/>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Save</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
