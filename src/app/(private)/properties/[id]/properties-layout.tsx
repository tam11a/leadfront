"use client";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Loading } from "../../token-validation-checker";
import { useGetMediaById } from "@/lib/actions/media/get-by-id";
// import { UpdateMedia } from "../update-media";
import { Button } from "@/components/ui/button";
import { useGetProductById } from "@/lib/actions/properties/get-by-id";
import { UpdateProperty } from "../update-property";
import { Badge } from "@/components/ui/badge";
import PropertiesSideBar from "./side-details";
// import MediaContactBar from "./contact";
// import TabNav from "./tab-nav";

export default function PropertyLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
  const { data } = useGetProductById(params.id);
  console.log(data);
  return !data ? (
    <Loading />
  ) : (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-row items-center justify-between py-5 px-8">
          <div className="space-y-1">
            <h1 className="text-sm font-semibold text-muted-foreground">
              Property Details #{params.id}
            </h1>
            <div className="flex flex-row gap-4">
              <p className="text-xl font-bold">{data?.data.product_uid}</p>
              <Badge className="h-6">Available</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Last Updated: {format(data?.data.updated_at, "PPP")}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Created: {format(data?.data.created_at, "PPP")}
              </p>
            </div>
          </div>
          <div className="hidden md:flex flex-row items-center gap-3">
            <UpdateProperty propertyId={params.id}>
              <Button variant={"outline"}>Update</Button>
            </UpdateProperty>
          </div>
        </div>
        <Separator />
        <div className="flex h-full flex-1 relative flex-col-reverse md:flex-row items-start md:justify-between">
          <div className="flex-1 px-7 py-6">
            <div className="md:hidden mb-4">{/* <TabNav /> */}</div>
            <div>{children}</div>
          </div>
          <PropertiesSideBar
            {...{
              id: params?.id,
              phone: data?.data.phone,
              email: data?.data.email,
              address: data?.data.address,
              address2: data?.data.address2,
              product_typeName: data?.data.product_typeName,
              land_type: data?.data.land_type,
              size: data?.data.size,
            }}
          />
        </div>
      </div>
    </>
  );
}
