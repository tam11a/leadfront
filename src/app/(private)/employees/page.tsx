import { Separator } from "@/components/ui/separator";
import CustomerTable from "./table";

export default function Customers() {
	return (
		<div className="space-y-4 block">
			<div className="space-y-0.5 p-6 pb-1">
				<h2 className="text-2xl font-bold tracking-tight">Employees</h2>
				<p className="text-muted-foreground text-sm">
					Here&apos;s a list of your employees!
				</p>
			</div>
			<Separator />

			<div className="px-9">
				<CustomerTable />
			</div>
		</div>
	);
}
