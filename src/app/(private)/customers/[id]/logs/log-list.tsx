"use client";
import { useGetCustomerLogs } from "@/lib/actions/customer-logs/get-logs";

import { CreateLog } from "./create-log";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomerLogsPage({ id }: Readonly<{ id: number }>) {
  const { data: logData, isLoading: isLogLoading } = useGetCustomerLogs({
    customer_id: id,
  });

  return (
    <div className="space-y-3 px-4 lg:px-8 py-6 border-l h-full min-h-[400px] md:max-w-[350px]">
      <CreateLog id={id} />

      {isLogLoading ? (
        <>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        </>
      ) : (
        //
        <>
          <ScrollArea className="relative h-72 max-w-full">
            {logData?.data
              ?.sort((a: any, b: any) => b.id - a.id)
              ?.map((item: any) => {
                return (
                  <div key={item.id} className="py-2 flex flex-col gap-2">
                    {item?.type === 5 ? (
                      <>
                        <p className="text-sm text-text-light ">
                          <span className="underline text-sm font-bold text-primary">
                            {item?.name}
                          </span>{" "}
                          {item?.description}
                        </p>

                        <p className="font-medium text-sm bg-slate-100 dark:bg-slate-900 text-text p-3 my-1 max-w-xs break-words rounded whitespace-pre">
                          {item?.note}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-text-light">
                          <span className="underline text-sm font-bold text-primary">
                            {item?.description.substring(
                              0,
                              item?.description.indexOf(" ")
                            )}
                          </span>{" "}
                          {item?.description.substring(
                            item?.description.indexOf(" ") + 1
                          )}
                        </p>
                      </>
                    )}
                    <p className="font-semibold text-xs text-muted-foreground">
                      {moment(item.created_at).format("llll")}
                    </p>
                  </div>
                );
              })}
          </ScrollArea>
        </>
      )}
    </div>
  );
}
