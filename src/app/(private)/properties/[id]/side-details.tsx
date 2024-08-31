import { CardDescription, CardTitle } from "@/components/ui/card";

// Icons
import {
  IoLocationOutline,
  IoPersonOutline,
  IoPricetagOutline,
  IoPricetagsOutline,
} from "react-icons/io5";

//api call
import { useGetMediaById } from "@/lib/actions/media/get-by-id";
import Link from "next/link";
import { PiNoteLight } from "react-icons/pi";

export default function PropertiesSideBar(details: {
  id?: number;
  address?: string;
  areaName?: string;
  address2?: string;
  unitName?: string;
  publicPrice: number;
  privatePrice: number;
  media_id: number;
  remarks: string;
}) {
  const { data: mediaData, isLoading: mediaLoading } = useGetMediaById(
    details.media_id
  );
  return (
    <div className="space-y-3 px-8 py-6 border-l h-full md:min-w-[300px]">
      <h1 className="text-sm font-semibold text-muted-foreground">
        Basic Information
      </h1>

      <CardTitle>Public Price</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <IoPricetagOutline className="text-primary text-base" />
        <span className="lowercase">
          {details.publicPrice ? (
            <>{details.publicPrice} ৳ </>
          ) : (
            <>{"No public price added"}</>
          )}
        </span>
      </CardDescription>

      <CardTitle>Private Price</CardTitle>
      <CardDescription className="flex items-center space-x-2">
        <IoPricetagsOutline className="text-primary text-base" />
        <span className="lowercase">
          {details.privatePrice ? (
            <>{details.privatePrice} ৳ </>
          ) : (
            <>{"No private price added"}</>
          )}
        </span>
      </CardDescription>

      <CardTitle>Address</CardTitle>
      <CardDescription className="flex items-center space-x-2 text-wrap max-w-xs">
        <IoLocationOutline className="text-primary text-base " />
        <span>
          {[details.address, details.areaName].join(", ") || "No address added"}
        </span>
      </CardDescription>

      {details.address2 && (
        <CardDescription className="flex space-x-2 text-wrap max-w-xs items-center">
          <IoLocationOutline className="text-primary text-base" />
          <span>{details.address2 || "No address added"}</span>
        </CardDescription>
      )}
      <CardTitle>Media</CardTitle>
      <CardDescription className="flex space-x-2 text-wrap max-w-xs items-center">
        <IoPersonOutline className="text-primary text-base" />
        {details?.media_id ? (
          <>
            <Link
              href={`/medias/${details?.media_id}`}
              className="mx-4 text-primary underline-offset-4 hover:underline"
            >
              {[mediaData?.data?.first_name, mediaData?.data?.last_name].join(
                " "
              ) || "No media assigned"}
            </Link>
          </>
        ) : (
          <p className="mx-4">No media assigned</p>
        )}
      </CardDescription>
      {details.remarks && (
        <>
          <CardTitle>Remarks</CardTitle>
          <CardDescription className="flex space-x-2 text-wrap max-w-xs items-center">
            <PiNoteLight className="text-primary text-base" />
            <span>{details?.remarks}</span>
          </CardDescription>
        </>
      )}
    </div>
  );
}
