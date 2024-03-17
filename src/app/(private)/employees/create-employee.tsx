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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateEmployeeSchema = z.object({
	first_name: z.string().min(1, {
		message: "First name must be at least 1 character.",
	}),
	last_name: z.string().min(1, {
		message: "Last name must be at least 1 character.",
	}),
	employee_uid: z.string().min(1, {
		message: "Employee UID must be at least 1 character.",
	}),
	gender: z.enum(["Male", "Female", "Non Binary"]),
	email: z.string().email({
		message: "Email must be a valid email address.",
	}),
	phone: z.string().min(11, {
		message: "Phone number must be at least 11 characters.",
	}),
	dob: z.date().optional(),
	work_hour: z.any().optional(),
	salary: z.any().optional(),
	bank_name: z.string().optional(),
	bank_branch: z.string().optional(),
	bank_account_number: z.any().optional(),
	bank_routing_number: z.any().optional(),
	address: z.string().min(1, {
		message: "Address must be at least 1 character.",
	}),
	address2: z.string().optional(),
	zip_code: z.number().optional(),
	nid: z.any({
		description: "NID must be a number.",
	}),
	tin: z.any().optional(),
	is_active: z.boolean(),
	user_id: z.number().optional(),
});

type EmployeeFormValues = z.infer<typeof CreateEmployeeSchema>;

export function CreateEmployee() {
	const [open, setOpen] = useState(false);

	const form = useForm<EmployeeFormValues>({
		resolver: zodResolver(CreateEmployeeSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			employee_uid: "",
			gender: "Male",
			email: "",
			phone: "",
			address: "",
			nid: 0,
			is_active: true,
		},
		mode: "onChange",
	});

	const onSubmit = (data: EmployeeFormValues) => {
		console.log(data);
	};

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(o) => setOpen(o)}
			>
				<Button onClick={() => setOpen(true)}>Add New</Button>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Create Employee</SheetTitle>
						<SheetDescription>
							Complete the form below to create a new employee for your
							organization.
						</SheetDescription>
					</SheetHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-3 mt-6"
						>
							<div className="flex flex-row items-start gap-3">
								<FormField
									control={form.control}
									name="first_name"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>First Name</FormLabel>
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
											<FormLabel>Last Name</FormLabel>
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
								name="employee_uid"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Employee UID</FormLabel>
										<FormControl>
											<Input
												placeholder="CEO-001"
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
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
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
										<FormLabel>Email</FormLabel>
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
										<FormLabel>Phone</FormLabel>
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

							<div className="flex flex-row items-start gap-3">
								<FormField
									control={form.control}
									name="work_hour"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Work Hour</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="8"
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
									name="salary"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Salary</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="20000"
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

							<SheetFooter>
								<SheetClose asChild>
									<Button variant={"ghost"}>Cancel</Button>
								</SheetClose>
								<Button
									type="submit"
									// disabled={isPending}
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
