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

export function Scheduler({
  params,
}: {
  params: {
    id: number;
  };
}) {
  //Dummy Test
  const { locale } = useLocale();
  const { user } = useUser();
  const [property_id, setProperty_id] = React.useState("");
  const [timeZone, _setTimeZone] = React.useState("America/New_York");
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(date);
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);
  const handleChangeDate = (date: DateValue) => {
    setDate(date as CalendarDate);
  };
  console.log(property_id);
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
  const startDate = focusedDate + "T00:00:00.00Z";
  const endDate = focusedDate + "T12:00:00.00Z";

  const { data: shceduleData } = useGetschedules({
    visit_schedule__gte: startDate,
    visit_schedule__lte: endDate,
  });
  const { mutateAsync: createSchedule } = useCreateSchedule();
  async function onScheduleSubmit() {
    const res = await handleResponse(
      () =>
        createSchedule({
          visit_schedule: scheduleDate,
          customer_id: params?.id,
          employee_id: user?.id,
          property_id: property_id,
        }),
      [201]
    );
    if (res.status) {
      toast("Added!", {
        description: `Schedule has been created successfully.`,
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
  console.log(scheduleDate);
  return (
    <div className="border px-6 py-6 rounded-md max-w-3xl mx-auto">
      <div className="flex gap-2">
        <Calendar
          minValue={today(getLocalTimeZone())}
          defaultValue={today(getLocalTimeZone())}
          value={date}
          onChange={handleChangeDate}
          onFocusChange={(focused) => setFocusedDate(focused)}
        />
        <div className="flex flex-col min-w-[260px]">
          <RightPanel scheduleData={shceduleData} />
          <ScheduleDialog
            {...{
              date,
              timeZone,
              weeksInMonth,
              handleChangeAvailableTime,
              setProperty_id,
            }}
            customerId={params?.id}
          />
        </div>
      </div>
    </div>
  );
}
