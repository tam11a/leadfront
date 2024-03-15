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
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useUpdateArea } from "@/lib/actions/configuration/areas/patch-area";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useForm } from "react-hook-form";
import { MdOutlineEdit } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";

const UpdateAreaSchema = z.object({
	area_name: z
		.string()
		.min(1, {
			message: "Area name must be at least 1 character.",
		})
		.max(30, {
			message: "Area name must not be longer than 30 characters.",
		}),
});
type UpdateAreaValues = z.infer<typeof UpdateAreaSchema>;

export function UpdateSheet({
	old_data,
	open,
	setOpen,
}: {
	old_data: any;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const { mutateAsync: update, isPending } = useUpdateArea();

	const form = useForm<UpdateAreaValues>({
		resolver: zodResolver(UpdateAreaSchema),
		defaultValues: {
			area_name: old_data?.area_name,
		},
		mode: "onChange",
	});

	async function onSubmit(data: UpdateAreaValues) {
		form.clearErrors();
		const res = await handleResponse(() =>
			update({
				id: old_data.id,
				data,
			})
		);
		if (res.status) {
			toast("Updated!", {
				description: `Business area has been updated successfully.`,
				closeButton: true,
				important: true,
			});
			form.reset({
				area_name: res.data.area_name,
			});
			setOpen(false);
		} else {
			if (typeof res.data === "object") {
				Object.entries(res.data).forEach(([key, value]) => {
					form.setError(key as keyof UpdateAreaValues, {
						type: "validate",
						message: value as string,
					});
				});
				toast("Error!", {
					description: `There was an error updating business area. Please try again.`,
					important: true,
					action: {
						label: "Retry",
						onClick: () => onSubmit(data),
					},
				});
			} else {
				toast("Error!", {
					description: res.message,
					important: true,
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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
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

						<p className="text-right my-1 text-xs text-muted-foreground">
							Created: {moment(old_data.created_at).format("ll")}
						</p>
						<p className="text-right my-1 mb-3 text-xs text-muted-foreground">
							Last Updated: {moment(old_data.updated_at).format("ll")}
						</p>

						<SheetFooter>
							<Button
								type="submit"
								disabled={isPending}
							>
								Save changes
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
