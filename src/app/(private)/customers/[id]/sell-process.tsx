"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SellProcessProps {
	TriggerComponent: React.FC;
	propertyId: number;
	customerId: number;
}

const MarkAsSoldSchema = z.object({
	selling_price: z.number().positive(),
	sold_date: z.date(),
	property: z.number().positive(),
	customer: z.number().positive(),
});
type MarkAsSoldFormValues = z.infer<typeof MarkAsSoldSchema>;

export default function SellProcess({
	TriggerComponent,
	customerId,
	propertyId,
}: SellProcessProps) {
	const { user } = useUser();
	const form = useForm<MarkAsSoldFormValues>({
		resolver: zodResolver(MarkAsSoldSchema),
		defaultValues: {
			property: propertyId,
			customer: customerId,
			sold_date: new Date(),
			selling_price: 0,
		},
	});

	async function handleMarkAsSold(data: MarkAsSoldFormValues) {
		// Call the API to mark the property as sold
		console.log({
			...data,
		});
	}

	return (
		<Dialog>
			<DialogTrigger>
				<TriggerComponent />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Mark as sold</DialogTitle>
					<DialogDescription>
						Are you sure you want to mark this property as sold to customer#
						{customerId}?
					</DialogDescription>
				</DialogHeader>
				<Separator />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleMarkAsSold)}>
						<FormField
							control={form.control}
							name="sold_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sold Date</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													captionLayout="dropdown-buttons"
													selected={new Date(field.value)}
													onSelect={(e: any) =>
														field.onChange(format(e as Date, "yyyy-MM-dd"))
													}
													fromYear={moment().year() - 50}
													toYear={moment().year() + 50}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormDescription>
										Select the date the property was sold
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
