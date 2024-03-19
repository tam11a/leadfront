import { CardDescription, CardTitle } from "@/components/ui/card";
import { FiMail } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";

export default async function CustomerContactBar(contact: {
	phone?: string;
	email?: string;
	address?: string;
	address2?: string;
}) {
	return (
		<div className="space-y-3 px-8 py-6 border-l h-full">
			<CardTitle>Phone</CardTitle>
			<CardDescription className="flex items-center space-x-2">
				<LuPhoneCall />
				<span>{contact.phone || "No Phone Number Added"}</span>
			</CardDescription>

			<CardTitle>Email</CardTitle>
			<CardDescription className="flex items-center space-x-2">
				<FiMail />
				<span>{contact.email || "No Email Added"}</span>
			</CardDescription>

			<CardTitle>Address</CardTitle>
			<CardDescription className="flex items-center space-x-2">
				<IoLocationOutline />
				<span>{contact.address || "No Address Added"}</span>
			</CardDescription>
			{contact.address2 && (
				<CardDescription className="flex items-center space-x-2">
					<IoLocationOutline />
					<span>{contact.address2 || "No Address Added"}</span>
				</CardDescription>
			)}
		</div>
	);
}
