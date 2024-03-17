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
	work_hour: z.number().optional(),
	salary: z.number().optional(),
	bank_name: z.string().optional(),
	bank_branch: z.string().optional(),
	bank_account_number: z.number().optional(),
	bank_routing_number: z.number().optional(),
	address: z.string().min(1, {
		message: "Address must be at least 1 character.",
	}),
	address2: z.string().optional(),
	zip_code: z.number().optional(),
	nid: z.number().min(1, {
		message: "NID must be at least 1 character.",
	}),
	tin: z.number().optional(),
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
							className="space-y-6"
						>
							<div className="flex flex-row items-start gap-3 mt-5">
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
							<SheetFooter>
								<SheetClose asChild>
									<Button variant={"ghost"}>Cancel</Button>
								</SheetClose>
								<Button
									type="submit"
									// disabled={isPending}
								>
									Create
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		</>
	);
}
