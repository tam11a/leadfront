"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Label } from "@/components/ui/label";
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
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCustomers } from "@/lib/actions/customers/post-customers";
import handleResponse from "@/lib/handle-response";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateCustomerSchema = z.object({
	first_name: z.string().min(1, {
		message: "First name must be at least 1 character.",
	}),
	last_name: z.string().min(1, {
		message: "Last name must be at least 1 character.",
	}),
	gender: z.enum(["Male", "Female", "Non Binary"]),
	email: z.string().email({
		message: "Email must be a valid email address.",
	}),
	phone: z.string().min(11, {
		message: "Phone number must be at least 11 characters.",
	}),
	dob: z.any().optional(),
	bank_name: z.any().optional(),
	bank_branch: z.any().optional(),
	bank_account_number: z.any().optional(),
	bank_routing_number: z.any().optional(),
	address: z.string().min(1, {
		message: "Address must be at least 1 character.",
	}),
	address2: z.any().optional(),
	zip_code: z.any().optional(),
	nid: z
		.any({
			description: "NID must be a number.",
		})
		.optional(),
	is_active: z.boolean(),
	status: z.any(),
	priority: z.any().optional(),
	source: z.any().optional(),
	media_id: z.number().optional(),
	assigned_employee_id: z.number().optional(),
	project_id: z.number().optional(),
});

type CustomerFormValues = z.infer<typeof CreateCustomerSchema>;

export function CreateCustomer() {
	const [open, setOpen] = useState(false);
	const { mutateAsync: create, isPending } = useCreateCustomers();

	const form = useForm<CustomerFormValues>({
		resolver: zodResolver(CreateCustomerSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			gender: "Male",
			email: "",
			phone: "",
			address: "",
			nid: undefined,
			is_active: true,
		},
		mode: "onChange",
	});

	async function onSubmit(data: CustomerFormValues) {
		form.clearErrors();
		const res = await handleResponse(() => create(data), [201]);
		if (res.status) {
			toast("Added!", {
				description: `Customer has been created successfully.`,
				important: true,
			});
			form.reset();
			setOpen(false);
		} else {
			if (typeof res.data === "object") {
				Object.entries(res.data).forEach(([key, value]) => {
					form.setError(key as keyof CustomerFormValues, {
						type: "validate",
						message: value as string,
					});
				});
				toast("Error!", {
					description: `There was an error creating customer. Please try again.`,
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
		<>
			<Sheet
				open={open}
				onOpenChange={(o) => setOpen(o)}
			>
				<Button onClick={() => setOpen(true)}>Add New</Button>
				<SheetContent className="max-h-screen overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Create Customer</SheetTitle>
						<SheetDescription>
							Complete the form below to create a new customer.
						</SheetDescription>
					</SheetHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-3 mt-6 px-1"
						>
							<div className="flex flex-row items-start gap-3">
								<FormField
									control={form.control}
									name="first_name"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>First Name*</FormLabel>
											<FormControl>
												<Input
													placeholder="John"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="last_name"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Last Name*</FormLabel>
											<FormControl>
												<Input
													placeholder="Doe"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender*</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Male">Male (He/Him)</SelectItem>
												<SelectItem value="Female">Female (She/Her)</SelectItem>
												<SelectItem value="Non Binary">Others</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email*</FormLabel>
										<FormControl>
											<Input
												placeholder="example@domain.co"
												{...field}
											/>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone*</FormLabel>
										<FormControl>
											<Input
												placeholder="017XXXXXXXX"
												{...field}
											/>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dob"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date of Birth</FormLabel>
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
														selected={new Date(field.value)}
														onSelect={(e: any) =>
															field.onChange(format(e as Date, "yyyy-MM-dd"))
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-row items-start gap-3">
								<div className="w-1/2">
									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Status*</FormLabel>
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
								</div>
								<div className="w-1/2">
									<FormField
										control={form.control}
										name="priority"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Priority</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a priority" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Highest">Highest</SelectItem>
														<SelectItem value="High">High</SelectItem>
														<SelectItem value="Medium">Medium</SelectItem>
														<SelectItem value="Low">Low</SelectItem>
														<SelectItem value="Lowest">Lowest</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription></FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<FormField
								control={form.control}
								name="source"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Source</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a source" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Facebook">Facebook</SelectItem>
												<SelectItem value="Instagram">Instagram</SelectItem>
												<SelectItem value="Indeed">Indeed</SelectItem>
												<SelectItem value="Walk In">Walk In</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-row items-start gap-3">
								<FormField
									control={form.control}
									name="bank_name"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Bank Name</FormLabel>
											<FormControl>
												<Input
													placeholder="XYZ Bank"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="bank_branch"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Bank Branch</FormLabel>
											<FormControl>
												<Input
													placeholder="Dhaka, Chittagong Etc."
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex flex-row items-start gap-3">
								<FormField
									control={form.control}
									name="bank_account_number"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Bank Account Number</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="12938712*****78"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="bank_routing_number"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Bank Routing Number</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="123123"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Line 1*</FormLabel>
										<FormControl>
											<Textarea
												rows={5}
												placeholder="1234 Main St, City, Country"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your primary address. It must be a valid address.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="address2"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Line 2 </FormLabel>
										<FormControl>
											<Textarea
												rows={5}
												placeholder="1234 Main St, City, Country"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your secondary address. It is optional. If you
											enter any address it must be a valid address.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-row items-start gap-3">
								<FormField
									control={form.control}
									name="zip_code"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Zip Code</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="1240"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="nid"
								render={({ field }) => (
									<FormItem>
										<FormLabel>NID</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="10123*****"
												{...field}
											/>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="is_active"
								render={({ field }) => (
									<FormItem className="pt-4">
										<div className="flex flex-row items-center gap-2">
											<FormControl>
												<Switch
													id="is_active"
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<Label htmlFor="is_active">Active Status</Label>
										</div>
										<FormDescription>
											Active status will determine if the customer is active or
											not.
										</FormDescription>
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
		</>
	);
}
