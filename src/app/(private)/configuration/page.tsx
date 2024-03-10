import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BusinessAreasList from "./areas-list";

export default function Areas() {
	return (
		<div className="space-y-8">
			<CardHeader className="p-0">
				<CardTitle>Business Areas</CardTitle>
				<CardDescription>Update your business areas</CardDescription>
			</CardHeader>
			<BusinessAreasList />
		</div>
	);
}
