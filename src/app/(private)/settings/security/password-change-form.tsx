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
import { usePasswordChange } from "@/lib/actions/auth/password-change";
import { LuLoader2 } from "react-icons/lu";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";

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
		old_password: z.string().max(30, {
			message: "Password must not be longer than 30 characters.",
		}),
		new_password: z
			.string()
			.min(8, {
				message: "Password must be at least 8 characters.",
			})
			.max(30, {
				message: "Password must not be longer than 30 characters.",
			}),
		confirm_password: z
			.string()
			.min(8, {
				message: "Password must be at least 8 characters.",
			})
			.max(30, {
				message: "Password must not be longer than 30 characters.",
			}),
	})
	.refine((data) => data.new_password === data.confirm_password, {
		message: "Passwords do not match.",
		path: ["confirm_password"],
	})
	.refine((data) => data.old_password !== data.new_password, {
		message: "New password must be different from the old password.",
		path: ["new_password"],
	});

type PasswordChangeFormValues = z.infer<typeof passwordChangeFormSchema>;

export function PasswordChangeForm() {
	const { access } = useUser();
	const { mutateAsync: change, isPending } = usePasswordChange();

	const form = useForm<PasswordChangeFormValues>({
		resolver: zodResolver(passwordChangeFormSchema),
		defaultValues: {
			username: access?.data?.username,
			old_password: "",
			new_password: "",
			confirm_password: "",
		},
		mode: "onChange",
	});

	async function onSubmit(data: PasswordChangeFormValues) {
		const res = await handleResponse(() => change(data));

		if (res.status) {
			toast("Password updated successfully!", {
				closeButton: true,
				important: true,
			});
		} else {
			form.setError("old_password", {
				type: "validate",
				message: res.message,
			});
			toast("Failed to update password!", {
				description: res.message,
				important: true,
			});
		}

		form.reset();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="hidden">
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="John Doe"
									autoComplete="username"
									readOnly
									disabled
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Your username is how other people on the platform will see you.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

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

				<Button
					type="submit"
					disabled={isPending}
				>
					{isPending ? (
						<>
							<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
							Updating..
						</>
					) : (
						<>Update password</>
					)}
				</Button>
			</form>
		</Form>
	);
}
