"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Button } from "@/components/ui/button";

import useUser from "@/hooks/useUser";

const passwordChangeFormSchema = z
	.object({
		username: z
			.string()
			.min(2, {
				message: "Username must be at least 2 characters.",
			})
			.max(30, {
				message: "Username must not be longer than 30 characters.",
			}),
		old_password: z
			.string()
			.min(6, {
				message: "Password must be at least 6 characters.",
			})
			.max(30, {
				message: "Password must not be longer than 30 characters.",
			}),
		new_password: z
			.string()
			.min(6, {
				message: "Password must be at least 6 characters.",
			})
			.max(30, {
				message: "Password must not be longer than 30 characters.",
			}),
		confirm_password: z
			.string()
			.min(6, {
				message: "Password must be at least 6 characters.",
			})
			.max(30, {
				message: "Password must not be longer than 30 characters.",
			}),
	})
	.refine((data) => data.new_password === data.confirm_password, {
		message: "Passwords do not match.",
		path: ["confirm_password"],
	});

type PasswordChangeFormValues = z.infer<typeof passwordChangeFormSchema>;

export function PasswordChangeForm() {
	const { user } = useUser();

	const form = useForm<PasswordChangeFormValues>({
		resolver: zodResolver(passwordChangeFormSchema),
		defaultValues: {
			username: user?.data?.username,
			old_password: "",
			new_password: "",
			confirm_password: "",
		},
		mode: "onChange",
	});

	function onSubmit(data: PasswordChangeFormValues) {
		console.log(data);
		// toast({
		//   title: "You submitted the following values:",
		//   description: (
		//     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
		//       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
		//     </pre>
		//   ),
		// })
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
			>
				<FormField
					control={form.control}
					name="old_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Password</FormLabel>
							<FormControl>
								<Input
									placeholder="********"
									type="password"
									autoComplete="current-password"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Enter your current password to confirm your identity.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="new_password"
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
								Choose a strong password that you don&apos;t use elsewhere.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirm_password"
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
								Please confirm your new password.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Update password</Button>
			</form>
		</Form>
	);
}
