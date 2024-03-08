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

const profileFormSchema = z.object({
	username: z
		.string()
		.min(2, {
			message: "Username must be at least 2 characters.",
		})
		.max(30, {
			message: "Username must not be longer than 30 characters.",
		}),
	first_name: z
		.string()
		.min(2, {
			message: "First name must be at least 2 characters.",
		})
		.max(30, {
			message: "First name must not be longer than 30 characters.",
		}),
	last_name: z
		.string()
		.min(2, {
			message: "Last name must be at least 2 characters.",
		})
		.max(30, {
			message: "Last name must not be longer than 30 characters.",
		}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
	const { user } = useUser();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			username: user?.data?.username,
			first_name: user?.data?.first_name,
			last_name: user?.data?.last_name,
		},
		mode: "onChange",
	});

	function onSubmit(data: ProfileFormValues) {
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
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="John Doe"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is your public display name. It can be your real name or a
								pseudonym.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-col md:flex-row gap-4">
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
								<FormDescription>This is your first name.</FormDescription>
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
								<FormDescription>This is your last name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormItem>
					<FormLabel>Email</FormLabel>
					<FormControl>
						<Input
							placeholder="example@email.com"
							type="email"
							value={user?.data?.email}
							readOnly
						/>
					</FormControl>
					<FormDescription>
						This is your verified email address. You can&apos;t change it here.
						If you need to change it, please contact administrator.
					</FormDescription>
					<FormMessage />
				</FormItem>

				<Button type="submit">Update profile</Button>
			</form>
		</Form>
	);
}
