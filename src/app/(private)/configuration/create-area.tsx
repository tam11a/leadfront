"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateAreaSchema = z.object({
	area_name: z
		.string()
		.min(1, {
			message: "Area name must be at least 1 character.",
		})
		.max(30, {
			message: "Area name must not be longer than 30 characters.",
		}),
});
type CreateAreaValues = z.infer<typeof CreateAreaSchema>;

export function CreateSheet() {
	const [open, setOpen] = useState(false);

	const form = useForm<CreateAreaValues>({
		resolver: zodResolver(CreateAreaSchema),
		defaultValues: {
			area_name: "",
		},
		mode: "onChange",
	});

	async function onSubmit(data: CreateAreaValues) {
		console.log(data);
	}

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => setOpen(o)}
		>
			<Button onClick={() => setOpen(true)}>Add New</Button>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Create Business Area</SheetTitle>
					<SheetDescription>
						Complete the form below to create a new business area.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="area_name"
							render={({ field }) => (
								<FormItem className="mt-5">
									<FormLabel>Area Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Dhaka, Chittagong, etc."
											{...field}
										/>
									</FormControl>
									<FormDescription></FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SheetFooter>
							<SheetClose asChild>
								<Button variant={"ghost"}>Cancel</Button>
							</SheetClose>
							<Button type="submit">Save</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
