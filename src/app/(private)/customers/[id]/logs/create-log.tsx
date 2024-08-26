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

import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";
import { useCreateCustomerComment } from "@/lib/actions/customer-logs/post-customer-comment";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import handleResponse from "@/lib/handle-response";

import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Label } from "@/components/ui/label";
import Selection from "@/components/ui/selection";
import { CustomerStatusList } from "../../create-customer";
import { useUpdateCustomer } from "@/lib/actions/customers/patch-by-id";

const CreateCustomerMessageSchema = z.object({
	note: z
		.string()
		.min(1, { message: "Note must contain at least 1 character(s)" }),
	name: z.string(),
	type: z.number(),
	customer_id: z.number().optional(),
	employee_id: z.number().optional(),
	description: z.string().optional(),
});

type CreateCustomerMessageFormValues = z.infer<
	typeof CreateCustomerMessageSchema
>;

export function CreateLog({ id }: Readonly<{ id: number }>) {
	const { access, user } = useUser();
	const { data: customer, isLoading } = useGetCustomerById(id);
	const { mutateAsync: update, isPending } = useUpdateCustomer();
	const { mutateAsync: create } = useCreateCustomerComment();
	const [followup, setFollowup] = useState<Date | undefined>(undefined);
	const [status, setStatus] = useState<string | null>(null);

	const form = useForm<CreateCustomerMessageFormValues>({
		resolver: zodResolver(CreateCustomerMessageSchema),
		defaultValues: {
			note: "",
			type: 5,
			customer_id: customer?.data?.id,
			employee_id: access?.data?.user_id,
			description: "added a note.",
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (isLoading || !customer) return;
		form.reset({
			name: access?.data?.username,
			note: "",
			type: 5,
			description: "added a note.",
			customer_id: customer?.data?.id,
			employee_id: user?.id,
		});

		setFollowup(customer?.data?.followup);
		setStatus(customer?.data?.status);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customer]);

	const onSubmit = async (data: CreateCustomerMessageFormValues) => {
		form.clearErrors();
		const res = await handleResponse(() => create(data), [201]);
		if (res.status) {
			toast("Added!", {
				description: `Note has been Added successfully.`,
				important: true,
			});
			form.reset();
		} else {
			if (typeof res.data === "object") {
				Object.entries(res.data).forEach(([key, value]) => {
					form.setError(key as keyof CreateCustomerMessageFormValues, {
						type: "validate",
						message: value as string,
					});
				});
				toast("Error!", {
					description: `There was an error adding note. Please try again.`,
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
	};

	async function handleUpdateCustomer() {
		if (!customer) return;
		const res = await handleResponse(() =>
			update({
				id: customer.data.id,
				data: {
					status: status,
					followup: followup,
				},
			})
		);
		if (res.status) {
			toast("Updated!", {
				description: `Customer
        #${customer.data.id} has been updated successfully.`,
				important: true,
			});
		}
	}

	React.useEffect(() => {
		if (!customer || !status) return;

		if (
			status !== customer.data.status ||
			followup !== customer.data.followup
		) {
			handleUpdateCustomer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	return (
		<>
			<Label>Status</Label>
			<Selection
				options={CustomerStatusList}
				value={status}
				onChange={(v) => v && setStatus(v)}
				placeholder="Select a status"
			/>

			<div className="h-1" />

			<Label>Followup</Label>
			<DateTimePicker
				value={followup ? new Date(followup) : followup}
				onChange={setFollowup}
				placeholder="Followup Date"
				granularity="minute"
				hourCycle={12}
				weekStartsOn={6}
				onPopperClose={() => {
					if (!customer) return;
					if (followup !== customer?.data.followup) handleUpdateCustomer();
				}}
			/>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					onReset={() => {
						if (isLoading || !customer) return;
						form.reset({
							note: "",
						});
					}}
				>
					<FormField
						control={form.control}
						name="note"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Note</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Aa.."
										{...field}
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-row flex-wrap gap-2 my-3">
						<Button type="submit">Create Log</Button>
						<Button
							type="reset"
							variant={"secondary"}
						>
							Reset
						</Button>
					</div>
				</form>
			</Form>
			{/* </DialogContent>
    </Dialog> */}
		</>
	);
}
