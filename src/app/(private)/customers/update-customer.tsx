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
	SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import { useUpdateCustomer } from "@/lib/actions/customers/patch-by-id";
import handleResponse from "@/lib/handle-response";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Priorities, PriorityIcon } from "./[id]/contact";
import { useMedia } from "@/lib/actions/media/use-media";
import moment from "moment";

const UpdateCustomerSchema = z.object({
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
	nid: z.any({
		description: "NID must be a number.",
	}),
	is_active: z.boolean(),
	status: z.any(),
	priority: z.any(),
	source: z.any().optional(),
	media_id: z.any().optional(),
	media_commision: z.any().optional(),
	assigned_employee_id: z.number().optional(),
	project_id: z.number().optional(),
});

type CustomerFormValues = z.infer<typeof UpdateCustomerSchema>;

export function UpdateCustomer({
	children,
	customerId,
}: Readonly<{
	children?: React.ReactNode;
	customerId: number;
}>) {
	const [open, setOpen] = useState(false);
	const [search, _setSearch] = useState("");

	const { data: customer, isLoading } = useGetCustomerById(
		open ? customerId : undefined
	);
	const { data: mediaData, isLoading: mediaLoading } = useMedia(search);

	const form = useForm<CustomerFormValues>({
		resolver: zodResolver(UpdateCustomerSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			gender: "Male",
			email: "",
			phone: "",
			bank_name: "",
			bank_branch: "",
			bank_account_number: "",
			bank_routing_number: "",
			address: "",
			address2: "",
			zip_code: "",
			nid: undefined,
			is_active: true,
			status: "",
			priority: "",
			source: "",
			media_id: undefined,
			// assigned_employee_id: undefined,
			// project_id: undefined,
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (customer?.data && form.formState.isDirty === false) {
			form.reset({
				first_name: customer.data.first_name,
				last_name: customer.data.last_name,
				gender: customer.data.gender || "",
				email: customer.data.email,
				phone: customer.data.phone,
				dob: customer.data.dob,
				bank_name: customer.data.bank_name,
				bank_branch: customer.data.bank_branch,
				bank_account_number: customer.data.bank_account_number,
				bank_routing_number: customer.data.bank_routing_number,
				address: customer.data.address,
				address2: customer.data.address2,
				zip_code: customer.data.zip_code,
				is_active: customer.data.is_active,
				nid: customer.data.nid,
				status: customer.data.status || "",
				priority: customer.data.priority || "",
				source: customer.data.source || "",
				media_id: customer.data.media_id,
				media_commision: customer.data.media_commision,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customer]);

	const { mutateAsync: update, isPending } = useUpdateCustomer();

	async function onSubmit(data: CustomerFormValues) {
		form.clearErrors();
		const res = await handleResponse(() =>
			update({
				id: customerId,
				data,
			})
		);
		if (res.status) {
			toast("Updated!", {
				description: `Customer details has been updated successfully.`,
				closeButton: true,
				important: true,
			});
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
					description: `There was an error updating Customer details. Please try again.`,
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
				<SheetTrigger asChild>
					{children || <Button>Update</Button>}
				</SheetTrigger>
				<SheetContent className="max-h-screen overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Update Customer</SheetTitle>
						<SheetDescription>
							Please fill in the form to update the customer data.
						</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className="space-y-4 mt-5">
							<Skeleton className="h-16" />
							<Skeleton className="h-16" />
							<Skeleton className="h-16" />
							<Skeleton className="h-10 w-24 float-right" />
						</div>
					) : (
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
											<FormControl>
												<Select
													name={field.name}
													onValueChange={(v) => v && field.onChange(v)}
													value={field.value}
													disabled={field.disabled}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select a gender" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Male">Male (He/Him)</SelectItem>
														<SelectItem value="Female">
															Female (She/Her)
														</SelectItem>
														<SelectItem value="Non Binary">Others</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
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
															defaultMonth={new Date(field.value)}
															onSelect={(e: any) =>
																field.onChange(format(e as Date, "yyyy-MM-dd"))
															}
															captionLayout="dropdown-buttons"
															fromYear={moment().year() - 100}
															toYear={moment().year()}
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
													<FormControl>
														<Select
															onValueChange={(v) => v && field.onChange(v)}
															value={field.value}
														>
															<SelectTrigger>
																<SelectValue placeholder="Select a status" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="Raw">Raw</SelectItem>
																<SelectItem value="Prospect">
																	Prospect
																</SelectItem>
																<SelectItem value="High Prospect">
																	High Prospect
																</SelectItem>
																<SelectItem value="Priority">
																	Priority
																</SelectItem>
																<SelectItem value="Booked">Booked</SelectItem>
																<SelectItem value="Sold">Sold</SelectItem>
																<SelectItem value="Closed">Closed</SelectItem>
																<SelectItem value="Junk">Junk</SelectItem>
															</SelectContent>
														</Select>
													</FormControl>
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
														onValueChange={(v) => v && field.onChange(v)}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select a priority" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Priorities.map((priority) => (
																<SelectItem
																	value={priority}
																	key={priority}
																>
																	<span className="flex flex-row gap-2 items-center">
																		<PriorityIcon priority={priority} />
																		{priority}
																	</span>
																</SelectItem>
															))}
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
											<FormControl>
												<Select
													onValueChange={(v) => v && field.onChange(v)}
													value={field.value}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select a source" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Facebook">Facebook</SelectItem>
														<SelectItem value="Instagram">Instagram</SelectItem>
														<SelectItem value="Indeed">Indeed</SelectItem>
														<SelectItem value="Walk In">Walk In</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
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
												This is your primary address. It must be a valid
												address.
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
											<FormLabel>NID*</FormLabel>
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
									name="media_id"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Media</FormLabel>
											<FormControl>
												<Select
													name={field.name}
													onValueChange={(v) => v && field.onChange(v)}
													value={field.value?.toString()}
													disabled={mediaLoading}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select a Media" />
													</SelectTrigger>
													<SelectContent>
														{mediaData?.data?.map((media: any) => (
															<SelectItem
																value={media?.id.toString()}
																key={media?.id}
															>
																{`${media?.first_name} ${media?.last_name}`}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="media_commision"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Media Commision</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter an amount"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Make sure to enter the commision amount in bdt.
											</FormDescription>
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
												Active status will determine if the customer is active
												or not.
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
					)}
				</SheetContent>
			</Sheet>
		</>
	);
}
