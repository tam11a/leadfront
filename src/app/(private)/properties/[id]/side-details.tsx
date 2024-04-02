import { CardDescription, CardTitle } from "@/components/ui/card";

// Icons
import { FiMail } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";

export default function PropertiesSideBar(details: {
  id?: number;
  phone?: string;
  email?: string;
  address?: string;
  address2?: string;
  product_typeName?: string;
  land_type?: string;
  size?: string;
}) {
  return (
    <div className="space-y-3 px-8 py-6 border-l h-full md:min-w-[300px]">
      <h1 className="text-lg font-semibold text-muted-foreground">
        Property Information
      </h1>
      <CardTitle>Property Type</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <LuPhoneCall className="text-primary" />
        <span>
          {details.product_typeName ? (
            <>{[details.product_typeName, details.land_type].join(", ")} </>
          ) : (
            <>{"No Property Type Added"}</>
          )}
        </span>
      </CardDescription>
      <CardTitle>Phone</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <LuPhoneCall className="text-primary" />
        <span>{details.phone || "No Phone Number Added"}</span>
      </CardDescription>

      <CardTitle>Email</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <FiMail className="text-primary" />
        <span>{details.email || "No Email Added"}</span>
      </CardDescription>

      <CardTitle>Address</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <IoLocationOutline className="text-primary" />
        <span>{details.address || "No Address Added"}</span>
      </CardDescription>
      {details.address2 && (
        <CardDescription className="flex items-center space-x-2">
          <IoLocationOutline className="text-primary" />
          <span>{details.address2 || "No Address Added"}</span>
        </CardDescription>
      )}
    </div>
  );
}
