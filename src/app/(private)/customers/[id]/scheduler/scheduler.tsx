"use client";

import { Calendar } from "./scheduler-calendar";
import handleResponse from "@/lib/handle-response";

import {
  type CalendarDate,
  getLocalTimeZone,
  getWeeksInMonth,
  today,
} from "@internationalized/date";
import type { DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { Button } from "@/components/ui/button";

import * as React from "react";
import { useCreateSchedule } from "@/lib/actions/schedule/post-schedule";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";
import { ScheduleDialog } from "./schedule-dialog";
import { RightPanel } from "./right-panel";
import { useGetschedules } from "@/lib/actions/schedule/get-schedule";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Scheduler({
  params,
}: {
  params: {
    id: number;
  };
}) {
  //Dummy Test
  const { locale } = useLocale();
  const [timeZone, _setTimeZone] = React.useState("America/New_York");
  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(date);
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);
  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate);
  };

  const startDate = focusedDate + "T00:00:00.00Z";
  const endDate = focusedDate + "T12:00:00.00Z";

  const { data: shceduleData } = useGetschedules({
    visit_schedule__gte: startDate,
    visit_schedule__lte: endDate,
  });

  // console.log(property_id);
  return (
    <div className="border px-6 py-6 rounded-md max-w-3xl mx-auto">
      <div className="lg:flex">
        <Calendar
          minValue={today(getLocalTimeZone())}
          defaultValue={today(getLocalTimeZone())}
          value={date}
          onChange={handleChangeDate}
          onFocusChange={(focused) => setFocusedDate(focused)}
        />
        <div className="flex flex-col min-w-[260px]">
          <ScrollArea
            type="always"
            className="h-full p-4"
            style={{
              maxHeight: weeksInMonth > 5 ? "380px" : "320px",
            }}
          >
            <RightPanel scheduleData={shceduleData} />
          </ScrollArea>
          <ScheduleDialog
            {...{
              date,
              timeZone,
              weeksInMonth,
            }}
            customerId={params?.id}
          />
        </div>
      </div>
    </div>
  );
}
