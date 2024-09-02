import { CardDescription, CardTitle } from "@/components/ui/card";

// Icons
import {
  IoCalendarClearOutline,
  IoCardOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoPricetagOutline,
  IoPricetagsOutline,
} from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";

//api call
import { useGetMediaById } from "@/lib/actions/media/get-by-id";
import Link from "next/link";
import { PiMoneyLight, PiNoteLight } from "react-icons/pi";
import { BsGenderAmbiguous, BsTelephone } from "react-icons/bs";
import { MdOutlineMailOutline } from "react-icons/md";

export default function EmployeeSideDetails(details: {
  id?: number;
  employee_uid?: number;
  gender?: string;
  dob?: string;
  address?: string;
  address2?: string;
  email?: string;
  nid?: number;
  phone?: string;
  salary?: string;
  tin?: string;
  bank_account_number?: number;
}) {
  return (
    <div className="space-y-3 px-8 py-6 border-l h-full md:min-w-[300px]">
      <h1 className="text-sm font-semibold text-muted-foreground">
        Basic Information
      </h1>

      <CardTitle>Employee UID</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <IoPricetagOutline className="text-primary text-base" />
        <span className="lowercase">
          {details.employee_uid ? (
            <>{details.employee_uid}</>
          ) : (
            <>{"No Employee UID added"}</>
          )}
        </span>
      </CardDescription>

      <CardTitle>Email</CardTitle>
      <CardDescription className="flex items-center space-x-2 ">
        <MdOutlineMailOutline className="text-primary text-base " />
        <span className="break-words max-w-48">
          {details.email || "No email added"}
        </span>
      </CardDescription>
      <CardTitle>Phone</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <BsTelephone className="text-primary text-base" />
        <span className="lowercase">
          {details.phone ? <>{details.phone}</> : <>{"No phone added"}</>}
        </span>
      </CardDescription>
      <CardTitle>Gender</CardTitle>
      <CardDescription className="flex space-x-2 text-wrap max-w-[300px] items-center">
        <BsGenderAmbiguous className="text-primary text-base" />
        {details?.gender ? (
          <span className="mx-4">
            {details?.gender || "No gender assigned"}
          </span>
        ) : (
          <span className="mx-4">No gender assigned</span>
        )}
      </CardDescription>
      <CardTitle>Date of Birth</CardTitle>
      <CardDescription className="flex space-x-2 text-wrap max-w-xs items-center">
        <IoCalendarClearOutline className="text-primary text-base" />
        {details?.dob ? (
          <>
            <span className="mx-4">
              {details?.dob || "No Date of Birth added"}
            </span>
          </>
        ) : (
          <span className="mx-4">No Date of Birth added</span>
        )}
      </CardDescription>
      <CardTitle>Address</CardTitle>
      <CardDescription className="flex items-center space-x-2 ">
        <IoLocationOutline className="text-primary text-base " />
        <span>{details.address || "No address added"}</span>
      </CardDescription>

      {details.address2 && (
        <CardDescription className="flex space-x-2 text-wrap max-w-[300px] items-center">
          <IoLocationOutline className="text-primary text-base" />
          <span>{details.address2 || "No address added"}</span>
        </CardDescription>
      )}

      {details.salary && (
        <>
          <CardTitle>Salary</CardTitle>
          <CardDescription className="flex space-x-2 text-wrap max-w-xs items-center">
            <PiMoneyLight className="text-primary text-base" />
            <span>{details?.salary} ৳</span>
          </CardDescription>
        </>
      )}
      {details.nid && (
        <>
          <CardTitle>NID</CardTitle>
          <CardDescription className="flex space-x-2 text-wrap max-w-xs items-center">
            <IoCardOutline className="text-primary text-base" />
            <span>{details?.nid}</span>
          </CardDescription>
        </>
      )}
      {details.tin && (
        <>
          <CardTitle>TIN</CardTitle>
          <CardDescription className="flex space-x-2 text-wrap max-w-xs items-center">
            <PiNoteLight className="text-primary text-base" />
            <span>{details?.tin}</span>
          </CardDescription>
        </>
      )}
    </div>
  );
}
