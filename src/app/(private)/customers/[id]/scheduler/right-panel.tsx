"use client";

import moment from "moment";
import Link from "next/link";
import { TbBuildingCommunity } from "react-icons/tb";

export function RightPanel({ scheduleData }: { scheduleData: any }) {
  return (
    <div className="flex flex-col gap-4 flex-1 border-l pl-6">
      {scheduleData?.data?.map((d: any) => (
        <div className="border rounded-md p-4">
          <div className="space-y-1">
            <div className="">
              <p className="text-sm font-semibold text-muted-foreground">
                Schedule Details #{d?.id}
              </p>
              <h1 className="flex items-center font-bold gap-1 text-primary">
                <TbBuildingCommunity />
                <Link href={`/properties/${d.property_id?.id}`}>
                  {d?.property_id?.product_uid}
                </Link>
              </h1>
            </div>
            <div>
              <p className="text-sm text-muted-foreground ">
                Address : {d?.property_id?.adress}
              </p>
              <p className="text-sm text-muted-foreground">
                Schedule Time : {moment(d?.visit_schedule).format("lll")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
