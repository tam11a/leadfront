"use client";
import { useGetCustomerLogs } from "@/lib/actions/customer-logs/get-logs";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
// 	Form,
// 	FormControl,
// 	FormDescription,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "@/components/ui/popover";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import useUser from "@/hooks/useUser";
// import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
// import { cn } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CalendarIcon } from "@radix-ui/react-icons";
// import { format } from "date-fns";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
import { CreateLog } from "./create-log";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import moment from "moment";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// const CreateCustomerMessageSchema = z.object({
//   note: z.string().optional(),
//   followup: z.any().optional(),
//   status: z.any().optional(),
// });

// type CreateCustomerMessageFormValues = z.infer<
//   typeof CreateCustomerMessageSchema
// >;

export default function CustomerLogsPage({ id }: Readonly<{ id: number }>) {
  const { data: customer, isLoading } = useGetCustomerById(id);

  const { data: logData, isLoading: isLogLoading } = useGetCustomerLogs({
    customer_id: customer?.data?.id,
  });
  // console.log(logData);

  return (
    <div className="space-y-3 px-8 py-6 border-l h-full min-h-[400px] md:min-w-[300px]">
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
        <>
          {logData?.data
            ?.sort((a: any, b: any) => b.id - a.id)
            .map((item: any) => {
              return (
                <div key={item.id} className="my-4 flex flex-col gap-1">
                  {item?.type === 1 ? (
                    <>
                      <p className="font-semibold text-sm text-text-light"></p>
                    </>
                  ) : item?.type === 2 ? (
                    <></>
                  ) : item?.type === 3 ? (
                    <></>
                  ) : item?.type === 4 ? (
                    <></>
                  ) : item?.type === 5 ? (
                    <>
                      <div className="flex items-center gap-1">
                        <p className="underline text-sm font-bold">
                          {item?.name}
                        </p>
                        <p className="text-sm text-text-light">
                          {item?.description}.
                        </p>
                      </div>

                      <p className="font-medium text-sm bg-slate-100 dark:bg-slate-900 text-text p-3 my-1 max-w-xs whitespace-pre-wrap rounded">
                        {item?.note}
                      </p>
                    </>
                  ) : item?.type === "conversation" ? (
                    <div className="font-medium text-sm bg-slate-100 dark:bg-slate-900 text-text p-3 my-1 max-w-xs whitespace-pre-wrap rounded">
                      {item?.conversation}
                    </div>
                  ) : (
                    <></>
                  )}
                  <p className="font-semibold text-xs text-text-light">
                    {moment(item.created_at).format("ddd, MMM D, YYYY")}
                  </p>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
