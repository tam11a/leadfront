"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/lib/actions/auth/register";
import { useUpdateEmployee } from "@/lib/actions/employees/patch-by-id";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateAccessSchema = z
	.object({
		email: z.string().email(),
		username: z.string().min(1),
		password: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		password2: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		role: z.enum(["Admin", "Staff", "Staff2"]),
	})
	.refine((data) => data.password === data.password2, {
		message: "Passwords do not match.",
		path: ["password2"],
	});

type CreateAccessValues = z.infer<typeof CreateAccessSchema>;

export function CreateAccessDialog({
	children,
	employeeId,
	email,
}: Readonly<{
	children?: React.ReactNode;
	employeeId: number;
	email: string;
}>) {
	const [open, setOpen] = useState(false);

	const form = useForm<CreateAccessValues>({
		resolver: zodResolver(CreateAccessSchema),
		defaultValues: {
			email,
			username: "",
			password: "",
			password2: "",
			role: "Admin",
		},
		mode: "onChange",
	});

	const { mutateAsync: register, isPending } = useRegister();
	const { mutateAsync: update, isPending: isUpdatePending } =
		useUpdateEmployee();

	async function onSubmit(data: CreateAccessValues) {
		const res = await handleResponse(
			() =>
				register({
					...data,
					employee_id: employeeId,
				}),
			[201]
		);
		if (res.status) {
			toast("Access created successfully.", {
				important: true,
			});
			setOpen(false);
		} else {
			if (typeof res.data === "object") {
				Object.entries(res.data).forEach(([key, value]) => {
					form.setError(key as keyof CreateAccessValues, {
						type: "validate",
						message: value as string,
					});
				});
				toast("Error!", {
					description: `There was an error creating access. Please check the form and try again.`,
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
		<Dialog
			open={open}
			onOpenChange={(o) => setOpen(o)}
		>
			<DialogTrigger asChild>
				{children || (
					<Button
						variant={"link"}
						size={"sm"}
					>
						Create Access
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Access</DialogTitle>
					<DialogDescription>
						Create credentials for employee #{employeeId}
					</DialogDescription>
				</DialogHeader>
				<ScrollArea>
					<Form {...form}>
						<form
							className="max-h-[75vh] px-1 space-y-3 mt-3"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="john_doe, rudolf_tam, etc."
												autoComplete="username"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is the username for the employee.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input
												placeholder="********"
												type="password"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Please enter new password.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password2"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm New Password</FormLabel>
										<FormControl>
											<Input
												placeholder="********"
												type="password"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Please re-enter new password to confirm.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Admin">
													Admin (Full Access)
												</SelectItem>
												<SelectItem value="Staff">
													Staff (Limited Access)
												</SelectItem>
												<SelectItem value="Staff2">
													Staff2 (Limited Access)
												</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Select the role for the employee.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="pt-2">
								<DialogTrigger asChild>
									<Button variant={"ghost"}>Close</Button>
								</DialogTrigger>
								<Button
									type="submit"
									disabled={isPending || isUpdatePending}
								>
									Save
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
