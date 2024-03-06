"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/lib/actions/auth/sign-in";
import { LuLoader2 } from "react-icons/lu";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";

const formSchema = z.object({
	username: z
		.string()
		.min(6, {
			message: "Username must be at least 6 characters.",
		})
		.max(155, {
			message: "Username must be at most 155 characters.",
		}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
});

export function SignForm() {
	const { mutateAsync: login, isPending } = useLogin();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		form.clearErrors();
		const res = await handleResponse(() => login(values));
		if (res.status) {
			// Do something with the response
		} else {
			form.setError("username", {
				type: "validate",
				message: "",
			});
			form.setError("password", {
				type: "validate",
				message: res.message,
			});
			toast("Request failed", {
				description: res.message,
				important: true,
				action: {
					label: "Retry",
					onClick: () => onSubmit(values),
				},
			});
		}
	}

	return (
		<Form {...form}>
			<Card className="mx-2">
				<CardHeader>
					<CardTitle>Welcome</CardTitle>
					<CardDescription>
						Sign in with your organization credentials.
					</CardDescription>
				</CardHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-3">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											autoComplete="username"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											autoComplete="current-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full"
							size={"lg"}
							disabled={isPending}
						>
							{isPending ? (
								<>
									<LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in..
								</>
							) : (
								<>Sign in</>
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	);
}
