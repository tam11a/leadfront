import { CardDescription, CardTitle } from "@/components/ui/card";

// Icons
import { FiMail } from "react-icons/fi";
import { IoLocationOutline, IoPersonOutline } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { VscSourceControl } from "react-icons/vsc";

// Priority Icon
import { RiArrowUpDoubleFill } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import { PiEqualsBold } from "react-icons/pi";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowDownDoubleFill } from "react-icons/ri";
import { useGetMediaById } from "@/lib/actions/media/get-by-id";
import Link from "next/link";
import { BiCalendarEvent } from "react-icons/bi";
import moment from "moment";

export const Priorities = [
  "Lowest",
  "Low",
  "Medium",
  "High",
  "Highest",
] as const;

export const PriorityIcon = ({ priority }: { priority?: string }) => {
  switch (priority) {
    case "Highest":
      return <RiArrowUpDoubleFill className="text-primary" />;
    case "High":
      return <RiArrowUpSLine className="text-primary" />;
    case "Medium":
      return <PiEqualsBold className="text-primary" />;
    case "Low":
      return <RiArrowDownSLine className="text-primary" />;
    case "Lowest":
      return <RiArrowDownDoubleFill className="text-primary" />;
    default:
      return <PiEqualsBold className="text-primary" />;
  }
};

export default function CustomerContactBar(contact: {
  phone?: string;
  email?: string;
  address?: string;
  address2?: string;
  status?: string;
  priority?: string;
  source?: string;
  media_id?: number;
  followup?: string;
}) {
  const { data } = useGetMediaById(contact.media_id);
  return (
    <div className="space-y-3 px-8 py-6 md:border-r h-full md:min-w-[250px]">
      <CardTitle>Phone</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <LuPhoneCall className="text-primary" />
        <span>{contact.phone || "No Phone Number Added"}</span>
      </CardDescription>

      <CardTitle>Email</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <FiMail className="text-primary" />
        <span>{contact.email || "No Email Added"}</span>
      </CardDescription>

      <CardTitle>Address</CardTitle>
      <CardDescription className="flex space-x-2 text-wrap max-w-xs items-start">
        <span>
          <IoLocationOutline className="text-primary mt-1" />
        </span>
        <span>{contact.address || "No Address Added"}</span>
      </CardDescription>
      {contact.address2 && (
        <CardDescription className="flex space-x-2 text-wrap max-w-xs items-start">
          <span>
            <IoLocationOutline className="text-primary mt-1" />
          </span>
          <span>{contact.address2 || "No Address Added"}</span>
        </CardDescription>
      )}

      <CardTitle>Status</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <HiOutlineStatusOnline className="text-primary" />
        <span>{contact.status || "No Status Added"}</span>
      </CardDescription>

      <CardTitle>Priority</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <PriorityIcon priority={contact.priority} />
        <span>{contact.priority || "No Priority Added"}</span>
      </CardDescription>

      <CardTitle>Followup</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <BiCalendarEvent className="text-primary" />
        <span>
          {contact.followup
            ? moment(contact.followup).format("llll")
            : "No Followup Added"}
        </span>
      </CardDescription>

      <CardTitle>Source</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <VscSourceControl className="text-primary" />
        <span>{contact.source || "No Source Added"}</span>
      </CardDescription>
      <CardTitle>Media</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <IoPersonOutline className="text-primary" />
        {contact?.media_id ? (
          <>
            <Link
              href={`/medias/${contact?.media_id}`}
              className="mx-4 text-primary underline-offset-4 hover:underline"
            >
              {[data?.data?.first_name, data?.data?.last_name].join(" ") ||
                "No Media Added"}
            </Link>
          </>
        ) : (
          <p className="mx-4">No Media Added</p>
        )}
      </CardDescription>
    </div>
  );
}
