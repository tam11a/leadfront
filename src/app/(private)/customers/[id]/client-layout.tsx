"use client";

import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import { UpdateCustomer } from "../update-customer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
// import TabNav from "./tab-nav";
import CustomerContactBar from "./contact";
import { Loading } from "../../token-validation-checker";
import CustomerLogsPage from "./logs/log-list";
import { Badge } from "@/components/ui/badge";
import TabNav from "./tab-nav";
import { Scheduler } from "./scheduler/scheduler";

export default function ClientLayout({
	children,
	params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
	const { data } = useGetCustomerById(params.id);
	return !data ? (
		<Loading />
	) : (
		<>
			<div className="min-h-screen flex flex-col">
				<div className="flex flex-row items-start md:items-center justify-between py-5 px-8">
					<div className="space-y-1">
						<div className="flex gap-2">
							<h1 className="text-sm font-semibold text-muted-foreground">
								Customer Details #{params.id}
							</h1>
							<Badge
								variant={data?.data?.is_active ? "success" : "destructive"}
								className="text-[10px] font-bold"
							>
								{data?.data?.is_active ? "Active" : "Inactive"}
							</Badge>
						</div>

						<p className="text-xl font-bold capitalize">
							{[data?.data.first_name, data?.data.last_name].join(" ")}{" "}
							{data?.data.gender === "Male"
								? "(He/Him)"
								: data?.data.gender === "Female"
								? "(She/Her)"
								: ""}
						</p>
						<div>
							<p className="text-sm text-muted-foreground font-medium">
								Last Updated: {format(data?.data.updated_at, "PPP")}
							</p>
							<p className="text-sm text-muted-foreground font-medium">
								Created: {format(data?.data.created_at, "PPP")}
							</p>
						</div>
					</div>

					<div className="md:flex flex-row items-start gap-3">
						<UpdateCustomer customerId={params.id}>
							<Button
								variant={"outline"}
								disabled={data?.data?.status === "sold"}
							>
								Update
							</Button>
						</UpdateCustomer>
					</div>
				</div>

				<Separator />

				<div className="flex h-full flex-1 relative flex-col md:flex-row items-start md:justify-between">
					<CustomerContactBar
						{...{
							phone: data?.data.phone,
							email: data?.data.email,
							address: data?.data.address,
							address2: data?.data.address2,
							status: data?.data.status,
							priority: data?.data.priority,
							source: data?.data.source,
							media_id: data?.data.media_id,
							followup: data?.data.followup,
						}}
					/>
					<div className="flex-1 px-7 py-6">
						<div>
							<Scheduler params={params} />
						</div>
						<div>{children}</div>
					</div>
					<div className="items-center">
						<CustomerLogsPage id={params.id} />
					</div>
				</div>
			</div>
		</>
	);
}
