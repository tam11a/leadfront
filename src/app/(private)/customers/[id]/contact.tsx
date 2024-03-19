import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
		<div className="space-y-3 px-8 py-6">
			<CardTitle>Phone</CardTitle>
			<CardDescription>
				<div className="flex items-center space-x-2">
					<LuPhoneCall />
					<span>{contact.phone || "No Phone Number Added"}</span>
				</div>
			</CardDescription>

			<CardTitle>Email</CardTitle>
			<CardDescription>
				<div className="flex items-center space-x-2">
					<FiMail />
					<span>{contact.email || "No Email Added"}</span>
				</div>
			</CardDescription>

			<CardTitle>Address</CardTitle>
			<CardDescription>
				<div className="flex items-center space-x-2">
					<IoLocationOutline />
					<span>{contact.address || "No Address Added"}</span>
				</div>
			</CardDescription>
			{contact.address2 && (
				<CardDescription>
					<div className="flex items-center space-x-2">
						<IoLocationOutline />
						<span>{contact.address2 || "No Address Added"}</span>
					</div>
				</CardDescription>
			)}
		</div>
	);
}
