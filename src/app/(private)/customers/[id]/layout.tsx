import { getCustomerById } from "@/lib/actions/customers/get-by-id";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { UpdateCustomer } from "../update-customer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CustomerContactBar from "./contact";
import TabNav from "./tab-nav";

export default async function CustomerDetailLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: {
		id: number;
	};
}>) {
	async function getData() {
		try {
			const res = await getCustomerById(params.id);
			return res.data;
		} catch (error: any) {
			if (error.response?.status === 404) return null;
			else throw new Error(error);
		}
	}

	const data = await getData();

	if (!data || data === null) return notFound();

	return (
		<>
			<div className="min-h-screen flex flex-col">
				<div className="flex flex-row items-center justify-between py-5 px-8">
					<div className="space-y-1">
						<h1 className="text-sm font-semibold text-muted-foreground">
							Customer Details #{params.id}
						</h1>
						<p className="text-xl font-bold">
							{[data.first_name, data.last_name].join(" ")}
						</p>
						<div>
							<p className="text-xs text-muted-foreground font-medium">
								Last Updated: {format(data.updated_at, "PPPP")}
							</p>
							<p className="text-xs text-muted-foreground font-medium">
								Created: {format(data.created_at, "PPPP")}
							</p>
						</div>
					</div>
					<div className="hidden md:inline-flex">
						<UpdateCustomer customerId={params.id}>
							<Button variant={"outline"}>Update</Button>
						</UpdateCustomer>
					</div>
				</div>
				<Separator />
				<div className="flex h-full flex-1 relative flex-col-reverse md:flex-row items-start md:justify-between">
					<div className="flex-1 px-7 py-6">
						<TabNav />
						<div>{children}</div>
					</div>
					<CustomerContactBar
						{...{
							phone: data.phone,
							email: data.email,
							address: data.address,
							address2: data.address2,
						}}
					/>
				</div>
			</div>
		</>
	);
}
