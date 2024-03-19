import { Separator } from "@/components/ui/separator";
import { getCustomerById } from "@/lib/actions/customers/get-by-id";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { UpdateCustomer } from "../update-customer";
import { Button } from "@/components/ui/button";
import CustomerContactBar from "./contact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CustomerDetailsPage({
	params,
}: {
	params: {
		id: number;
	};
}) {
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

	return data ? (
		<div>
			<div className="flex flex-row items-center justify-between py-5 px-8">
				<div className="space-y-1 ">
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
			<div className="flex h-full relative flex-col md:flex-row items-start md:justify-between">
				<CustomerContactBar
					{...{
						phone: data.phone,
						email: data.email,
						address: data.address,
						address2: data.address2,
					}}
				/>
				<Separator
					orientation="vertical"
					role="separator"
					className="relative min-h-[600px] hidden md:inline-flex"
				/>
				<Tabs
					defaultValue="details"
					className="flex-1 px-7 py-6"
				>
					<TabsList>
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="interests">Interests</TabsTrigger>
						<TabsTrigger value="logs">Logs</TabsTrigger>
					</TabsList>
					<TabsContent value="details">
						Make changes to your account here.
					</TabsContent>
					<TabsContent value="interests">
						Change your password here.
					</TabsContent>
					<TabsContent value="logs">Change your password here.</TabsContent>
				</Tabs>
			</div>
		</div>
	) : (
		<></>
	);
}