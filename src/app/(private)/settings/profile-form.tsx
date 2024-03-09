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
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const profileFormSchema = z.object({
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
	phone: z
		.string()
		.min(10, {
			message: "Phone number must be at least 10 characters.",
		})
		.max(15, {
			message: "Phone number must not be longer than 15 characters.",
		}),
	nid: z.number().int().min(10, { message: "NID must be at least 10 digits." }),
	gender: z.enum(["Male", "Female", "Non Binary"]),
	address: z
		.string()
		.min(10, {
			message: "Address must be at least 10 characters.",
		})
		.max(100, {
			message: "Address must not be longer than 100 characters.",
		}),
	address2: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
	const { user } = useUser();

	console.log(user);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			first_name: user?.data?.first_name,
			last_name: user?.data?.last_name,
			phone: user?.data?.phone,
			nid: user?.data?.nid,
			address: user?.data?.address,
			address2: user?.data?.address2,
			gender: user?.data?.gender,
		},
		mode: "onChange",
	});

	function onSubmit(data: ProfileFormValues) {
		console.log(data);
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
			>
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

				<div className="flex flex-col md:flex-row gap-4">
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input
										placeholder="013*******"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									This is your phone number. It must be a valid Bangladeshi
									phone number.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="nid"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>NID Card Number</FormLabel>
								<FormControl>
									<Input
										placeholder="*******"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									This is your National Identification Number.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-4">
					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem className="flex-1">
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
								<FormDescription>This is your gender identity.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormItem className="flex-1">
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
							This is your verified email address. You can&apos;t change it
							here. If you need to change it, please contact administrator.
						</FormDescription>
						<FormMessage />
					</FormItem>
				</div>

				<div className="flex flex-col md:flex-row gap-4">
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Address Line 1</FormLabel>
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
							<FormItem className="flex-1">
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
									This is your secondary address. It is optional. If you enter
									any address it must be a valid address.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-row flex-wrap gap-3">
					<Button type="submit">Update profile</Button>
					<Link
						href={"/logout"}
						replace
					>
						<Button variant={"destructive"}>Logout</Button>
					</Link>
				</div>
			</form>
		</Form>
	);
}
