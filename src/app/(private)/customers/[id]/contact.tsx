import { CardDescription, CardTitle } from "@/components/ui/card";

// Icons
import { FiMail } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { VscSourceControl } from "react-icons/vsc";

// Priority Icon
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import { PiEqualsDuotone } from "react-icons/pi";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowDownDoubleFill } from "react-icons/ri";

export const PriorityIcon = ({ priority }: { priority?: string }) => {
	switch (priority) {
		case "Highest":
			return <RiArrowUpDoubleFill />;
		case "High":
			return <RiArrowUpSLine />;
		case "Medium":
			return <PiEqualsDuotone />;
		case "Low":
			return <RiArrowDownSLine />;
		case "Lowest":
			return <RiArrowDownDoubleFill />;
		default:
			return <PiEqualsDuotone />;
	}
};

export default async function CustomerContactBar(contact: {
	phone?: string;
	email?: string;
	address?: string;
	address2?: string;
	status?: string;
	priority?: string;
	source?: string;
}) {
	return (
		<div className="space-y-3 px-8 py-6 border-l h-full md:min-w-[300px]">
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

			<CardTitle>Status</CardTitle>
			<CardDescription className="flex items-center space-x-2">
				<HiOutlineStatusOnline />
				<span>{contact.status || "No Status Added"}</span>
			</CardDescription>

			<CardTitle>Priority</CardTitle>
			<CardDescription className="flex items-center space-x-2">
				<PriorityIcon priority={contact.priority} />
				<span>{contact.priority || "No Priority Added"}</span>
			</CardDescription>

			<CardTitle>Source</CardTitle>
			<CardDescription className="flex items-center space-x-2">
				<VscSourceControl />
				<span>{contact.source || "No Source Added"}</span>
			</CardDescription>
		</div>
	);
}
