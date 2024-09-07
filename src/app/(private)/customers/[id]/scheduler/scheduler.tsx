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
import { LeftPanel } from "./left-panel";
import { RightPanel } from "./right-panel";
import { useGetschedules } from "@/lib/actions/schedule/get-schedule";

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

  const [timeZone, _setTimeZone] = React.useState("America/New_York");
  const [scheduleDate, setScheduleDate] = React.useState("");
  const [date, setDate] = React.useState(today(getLocalTimeZone()));
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate | null>(
    date
  );
  const weeksInMonth = getWeeksInMonth(focusedDate as DateValue, locale);
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
    console.log(currentDate.toISOString());

    currentDate.setHours(hours, minutes);
    setScheduleDate(currentDate.toISOString());
  };

  const { mutateAsync: createSchedule } = useCreateSchedule();
  const { data: shceduleData } = useGetschedules({
    visit_schedule: scheduleDate,
  });
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

  return (
    <div className="border px-6 py-6 rounded-md max-w-5xl mx-auto">
      <div className="flex gap-2">
        <div className="flex flex-col border-r pr-5">
          <LeftPanel
            {...{ date, timeZone, weeksInMonth, handleChangeAvailableTime }}
          />
          <Button
            className="mt-6"
            disabled={scheduleDate === ""}
            onClick={() => onScheduleSubmit()}
          >
            Add Schedule
          </Button>
        </div>

        <Calendar
          minValue={today(getLocalTimeZone())}
          defaultValue={today(getLocalTimeZone())}
          value={date}
          onChange={handleChangeDate}
          onFocusChange={(focused) => setFocusedDate(focused)}
        />
        <RightPanel scheduleDate={scheduleDate} />
      </div>
    </div>
  );
}
