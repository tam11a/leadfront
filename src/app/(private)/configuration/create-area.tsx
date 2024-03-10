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
import { useCreateArea } from "@/lib/actions/configuration/areas/post-area";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

	const { mutateAsync: create, isPending } = useCreateArea();

	const form = useForm<CreateAreaValues>({
		resolver: zodResolver(CreateAreaSchema),
		defaultValues: {
			area_name: "",
		},
		mode: "onChange",
	});

	async function onSubmit(data: CreateAreaValues) {
		form.clearErrors();
		const res = await handleResponse(() => create(data), [201]);
		if (res.status) {
			toast("Added!", {
				description: `Business area has been created successfully.`,
				closeButton: true,
				important: true,
			});
			form.reset();
			setOpen(false);
		} else {
			if (typeof res.data === "object") {
				Object.entries(res.data).forEach(([key, value]) => {
					form.setError(key as keyof CreateAreaValues, {
						type: "validate",
						message: value as string,
					});
				});
				toast("Error!", {
					description: `There was an error creating business area. Please try again.`,
					important: true,
					closeButton: true,
					action: {
						label: "Retry",
						onClick: () => onSubmit(data),
					},
				});
			} else {
				toast("Error!", {
					description: res.message,
					important: true,
					closeButton: true,
					action: {
						label: "Retry",
						onClick: () => onSubmit(data),
					},
				});
			}
		}
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
							<Button
								type="submit"
								disabled={isPending}
							>
								Save
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
