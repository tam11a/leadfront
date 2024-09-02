"use client";

import React from "react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Loading } from "../../token-validation-checker";
// import { UpdateMedia } from "../update-media";
import { Button } from "@/components/ui/button";
import { useGetProductById } from "@/lib/actions/properties/get-by-id";
import { UpdateProperty } from "../update-property";
import { Badge } from "@/components/ui/badge";
import PropertiesSideBar from "./side-details";
import TabNav from "./tab-nav";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProducts } from "@/lib/actions/properties/patch-by-id";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
// import MediaContactBar from "./contact";

export default function PropertyLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
  const { data } = useGetProductById(params.id);
  const status = React.useMemo(() => {
    return data?.data?.status || undefined;
  }, [data]);
  const { mutateAsync: update, isPending } = useUpdateProducts();

  async function onSubmit(data: string) {
    const res = await handleResponse(() =>
      update({
        id: params.id,
        data: {
          status: data,
        },
      })
    );
    if (res.status) {
      toast("Updated!", {
        description: `Property status has been updated successfully.`,
        closeButton: true,
        important: true,
      });
    } else {
      if (typeof res.data === "object") {
        toast("Error!", {
          description: `There was an error updating property status. Please try again.`,
          important: true,
          action: {
            label: "Retry",
            onClick: () => onSubmit(data),
          },
        });
      } else {
        toast("Error!", {
          description: res.message,
          important: true,
          action: {
            label: "Retry",
            onClick: () => onSubmit(data),
          },
        });
      }
    }
  }
  function getStatusColor(s: string) {
    switch (s) {
      case "available":
        return "default";
      case "booked":
        return "outline";
      case "sold":
        return "secondary";
      default:
        return "destructive";
    }
  }
  return !data ? (
    <Loading />
  ) : (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-row items-start md:items-center justify-between py-5 px-8">
          <div className="space-y-2">
            <h1 className="text-sm font-semibold text-muted-foreground">
              Property Details #{params.id}
            </h1>
            <div className="flex flex-col sm:flex-row md:gap-4">
              <p className="text-xl font-bold">{data?.data.product_uid}</p>
              <div className="sm:px-2">
                <Badge
                  className="h-6 capitalize"
                  variant={getStatusColor(status)}
                >
                  {data?.data?.status}
                </Badge>
              </div>
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
          <div className="flex flex-col gap-2">
            <UpdateProperty propertyId={params.id}>
              <Button
                variant={"outline"}
                disabled={data?.data?.status === "sold"}
              >
                Update
              </Button>
            </UpdateProperty>
            <Select
              onValueChange={(v) => {
                onSubmit(v);
              }}
              value={status}
              disabled={["sold", "junk"].includes(status)}
            >
              <SelectTrigger className="w-[136px]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="junk">Junk</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div className="flex h-full flex-1 relative flex-col-reverse md:flex-row items-start md:justify-between">
          <div className="flex-1 px-7 py-6">
            <div className="mb-10">
              <TabNav />
            </div>
            <div>{children}</div>
          </div>
          <PropertiesSideBar
            {...{
              id: params?.id,
              publicPrice: data?.data?.price_public,
              privatePrice: data?.data?.price_private,
              address: data?.data?.adress,
              areaName: data?.data?.areaName,
              address2: data?.data?.address2,
              size: data?.data?.size,
              unitName: data?.data?.unitName,
              media_id: data?.data?.media_id,
              media_commision: data?.data?.media_commision,
              remarks: data?.data?.remarks,
            }}
          />
        </div>
      </div>
    </>
  );
}
