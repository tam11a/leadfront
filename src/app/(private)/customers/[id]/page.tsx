"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetInterests,
  useGetInterestsList,
} from "@/lib/actions/interests/get-interests";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FiActivity } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { Loading } from "../../token-validation-checker";
import { CreateInterest } from "./create-interest";
import { useDeleteInterest } from "@/lib/actions/interests/delete-interests";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
import { LuCheckCheck } from "react-icons/lu";
import SellProcess from "./sell-process";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

//Dummy Test

import { Calendar } from "./scheduler";

import {
  type CalendarDate,
  getLocalTimeZone,
  getWeeksInMonth,
  today,
} from "@internationalized/date";
import type { DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { RightPanel } from "./scheduler/right-panel";
import { useCreateSchedule } from "@/lib/actions/schedule/post-schedule";
import useUser from "@/hooks/useUser";

export default function CustomerInterestsPage({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [search, setSearch] = useState("");
  const { user } = useUser();
  const { data: customerData } = useGetCustomerById(params.id);
  const { data, isLoading } = useGetInterestsList({
    customer_id: params.id,
  });
  const { mutateAsync: Delete, isPending: isDeleting } = useDeleteInterest();
  if (isLoading) return <Loading />;
  async function onDelete(Iid: number) {
    const res = await handleResponse(() => Delete(Iid), 204);
    if (res.status) {
      toast("Deleted!", {
        description: `Interest has been deleted successfully.`,
        closeButton: true,
        important: true,
      });
    } else {
      toast("Error!", {
        description: res.message,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onDelete(Iid),
        },
      });
    }
  }

  //Dummy Test
  const { locale } = useLocale();

  const [timeZone, _setTimeZone] = React.useState("America/New_York");
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate | null>(
    date
  );
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);
  console.log(scheduleDate);
  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate);
  };

  const handleChangeAvailableTime = (time: string) => {
    const timeValue = time.split(":").join(" ");

    const match = timeValue.match(/^(\d{1,2}) (\d{2})([ap]m)?$/i);
    if (!match) {
      return null;
    }

    let hours = Number.parseInt(match[1]);
    const minutes = Number.parseInt(match[2]);
    const isPM = match[3] && match[3].toLowerCase() === "pm";

    if (isPM && (hours < 1 || hours > 12)) {
      return null;
    }

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    const currentDate = date.toDate(timeZone);
    currentDate.setHours(hours, minutes);
    setScheduleDate(currentDate.toISOString());
  };

  const { mutateAsync: createSchedule } = useCreateSchedule();

  async function onScheduleSubmit() {
    const res = await handleResponse(
      () =>
        createSchedule({
          visit_schedule: scheduleDate,
          customer_id: params?.id,
          employee_id: user?.id,
        }),
      [201]
    );
    if (res.status) {
      toast("Added!", {
        description: `Filter Data has been Saved successfully.`,
        important: true,
      });
    } else {
      toast("Error!", {
        description: res.message,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onScheduleSubmit(),
        },
      });
    }
  }

  return !data?.data?.length ? (
    <div className="flex flex-col items-center justify-center min-w-[300px] w-full min-h-[400px] gap-5">
      <div className="border px-6 py-6 rounded-md max-w-max mx-auto">
        <div className="flex flex-col h-full  gap-">
          <div className="flex flex-1 gap-6">
            <Calendar
              minValue={today(getLocalTimeZone())}
              defaultValue={today(getLocalTimeZone())}
              value={date}
              onChange={handleChangeDate}
              onFocusChange={(focused) => setFocusedDate(focused)}
            />
            <RightPanel
              {...{ date, timeZone, weeksInMonth, handleChangeAvailableTime }}
            />
          </div>
          <Button
            className="mt-6 self-end"
            disabled={scheduleDate === ""}
            onClick={() => onScheduleSubmit()}
          >
            Add Schedule
          </Button>
        </div>
      </div>

      <FiActivity className="text-5xl mx-auto text-gray-400" />
      <CardDescription>No interest added yet.</CardDescription>
      <CreateInterest
        id={+params.id}
        ignoreProperties={data?.data?.map((d: any) => d.id || [])}
        status={customerData?.data.status}
      />
    </div>
  ) : (
    <div className="space-y-3 max-w-lg">
      {customerData?.data?.status.toLowerCase() === "sold" ? (
        <>
          <Alert>
            <AlertTitle>Customer Sold</AlertTitle>
            <AlertDescription>
              You can add components to your app using the cli.
            </AlertDescription>
          </Alert>
        </>
      ) : (
        ""
      )}
      {customerData?.data?.status === "junk" ? (
        <>
          <Alert variant={"destructive"}>
            <AlertTitle>Junk customer!</AlertTitle>
            <AlertDescription>
              This customer has been added to the junk customer list.
            </AlertDescription>
          </Alert>
        </>
      ) : (
        ""
      )}
      <div className="flex flex-row items-center gap-3">
        <Input
          placeholder="Search property name, area.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <CreateInterest
          id={+params.id}
          ignoreProperties={data?.data?.map((d: any) => d.product_id.id) || []}
          status={customerData?.data.status}
        />
      </div>
      {data?.data?.map((interest: any) => (
        <Card
          key={interest.id}
          className={cn(
            "flex flex-row justify-between",
            search &&
              !(
                interest.product_id.product_uid
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                interest.product_id.area.area_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              ? "hidden"
              : ""
          )}
        >
          <CardHeader>
            <CardTitle>
              <Link
                href={`/properties/${interest.product_id.id}`}
                className="text-primary hover:underline"
              >
                {interest.product_id.product_uid}
              </Link>
              {interest.product_id.status === "sold" && (
                <Badge className="ml-2" variant={"success"}>
                  {interest.product_id.status}
                </Badge>
              )}
            </CardTitle>
            <CardContent className="flex p-0 flex-col items-start flex-wrap">
              <span className="flex flex-row">
                <CardDescription>
                  {interest.product_id.area?.area_name}
                </CardDescription>
                <Badge className="ml-2" variant={"outline"}>
                  {interest.product_id.product_type?.product_type_name}
                </Badge>
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CardDescription className="line-clamp-2">
                      {interest.note}
                    </CardDescription>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-200 text-muted-foreground max-w-sm font-medium">
                    <p> {interest.note}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </CardHeader>
          <CardHeader className="flex flex-row items-center justify-center gap-2 space-y-0">
            <SellProcess
              TriggerComponent={(props) => (
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="text-lime-500"
                  {...props}
                >
                  <LuCheckCheck />
                </Button>
              )}
              propertyId={+interest.product_id.id}
              interestId={+interest.id}
              customerId={+params.id}
              disabled={
                interest?.product_id?.status === "sold" ||
                customerData?.data?.status === "sold" ||
                customerData?.data?.status === "junk"
              }
            />
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => onDelete(interest?.id)}
              disabled={interest?.product_id?.status === "sold"}
              className="text-destructive"
            >
              <MdOutlineDelete />
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
