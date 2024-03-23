"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateCustomerMessageSchema = z.object({
	note: z.string().optional(),
	followup: z.any().optional(),
	status: z.any().optional(),
});

type CreateCustomerMessageFormValues = z.infer<
	typeof CreateCustomerMessageSchema
>;

export default function CustomerLogsPage({
	params,
}: {
	params: {
		id: number;
	};
}) {
	const { user } = useUser();
	const form = useForm<CreateCustomerMessageFormValues>({
		resolver: zodResolver(CreateCustomerMessageSchema),
		defaultValues: {
			note: "",
			followup: undefined,
			status: undefined,
		},
	});

	const onSubmit = async (values: CreateCustomerMessageFormValues) => {
		console.log(values);
	};

	return (
		<div className="flex flex-col lg:flex-row-reverse">
			<Card className="lg:min-w-[300px] max-w-[350px]">
				<CardHeader>
					<CardTitle>Create Log</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Raw">Raw</SelectItem>
												<SelectItem value="Prospect">Prospect</SelectItem>
												<SelectItem value="High Prospect">
													High Prospect
												</SelectItem>
												<SelectItem value="Priority">Priority</SelectItem>
												<SelectItem value="Booked">Booked</SelectItem>
												<SelectItem value="Sold">Sold</SelectItem>
												<SelectItem value="Closed">Closed</SelectItem>
												<SelectItem value="Junk">Junk</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="followup"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Follow Up</FormLabel>
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
														fromDate={new Date()}
														selected={new Date(field.value)}
														onSelect={(e: any) =>
															field.onChange(format(e as Date, "yyyy-MM-dd"))
														}
														initialFocus={false}
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="note"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Note</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Aa.."
												{...field}
											/>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Create Log</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div></div>
		</div>
	);
}
