import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface SellProcessProps {
	TriggerComponent: React.FC;
	propertyId: number | string;
	customerId: number | string;
}

export default function SellProcess({ TriggerComponent }: SellProcessProps) {
	return (
		<Dialog>
			<DialogTrigger>
				<TriggerComponent />
			</DialogTrigger>
			<DialogContent>
				<h1>Dialog Content</h1>
			</DialogContent>
		</Dialog>
	);
}
