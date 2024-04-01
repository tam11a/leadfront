"use client";

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Loading } from "../../token-validation-checker";
import { useGetMediaById } from "@/lib/actions/media/get-by-id";
import { UpdateMedia } from "../update-media";
import { Button } from "@/components/ui/button";
import MediaContactBar from "./contact";
import TabNav from "./tab-nav";

export default function MediaLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
  const { data } = useGetMediaById(params.id);

  return !data ? (
    <Loading />
  ) : (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-row items-center justify-between py-5 px-8">
          <div className="space-y-1">
            <h1 className="text-sm font-semibold text-muted-foreground">
              Media Details #{params.id}
            </h1>
            <p className="text-xl font-bold">
              {[data?.data.first_name, data?.data.last_name].join(" ")}{" "}
              {data?.data.gender === "Male"
                ? "(He/Him)"
                : data?.data.gender === "Female"
                ? "(She/Her)"
                : ""}
            </p>
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
            <TabNav />
            <UpdateMedia mediaId={params.id}>
              <Button variant={"outline"}>Update</Button>
            </UpdateMedia>
          </div>
        </div>
        <Separator />
        <div className="flex h-full flex-1 relative flex-col-reverse md:flex-row items-start md:justify-between">
          <div className="flex-1 px-7 py-6">
            <div className="md:hidden mb-4">
              <TabNav />
            </div>
            <div>{children}</div>
          </div>
          <MediaContactBar
            {...{
              phone: data?.data.phone,
              email: data?.data.email,
              address: data?.data.address,
              address2: data?.data.address2,
            }}
          />
        </div>
      </div>
    </>
  );
}
