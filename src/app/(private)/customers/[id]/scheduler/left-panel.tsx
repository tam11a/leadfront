"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { availableTimes } from "./available-times";
import { useState } from "react";

export function LeftPanel({
  date,
  timeZone,
  weeksInMonth,
  handleChangeAvailableTime,
}: {
  date: DateValue;
  timeZone: string;
  weeksInMonth: number;
  handleChangeAvailableTime: (time: string) => void;
}) {
  const { locale } = useLocale();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dayNumber, dayName] = date
    .toDate(timeZone)
    .toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
    })
    .split(" ");

  const handleButtonClick = (time: string) => {
    setSelectedTime(time);
    handleChangeAvailableTime(time);
  };
  return (
    <Tabs defaultValue="12" className="flex flex-col gap-1 w-[260px]">
      <div>
        <p aria-hidden className="flex-1 align-center font-semibold text-md">
          {dayName} <span className="text-gray-11">{dayNumber}</span>
        </p>
      </div>
      {["12", "24"].map((time) => (
        <TabsContent key={time} value={time}>
          <ScrollArea
            type="always"
            className="h-full "
            style={{
              maxHeight: weeksInMonth > 5 ? "380px" : "320px",
            }}
          >
            <div className="flex flex-col max-h-64 pr-3">
              <div className="grid gap-2 pr-3">
                {availableTimes.map((availableTime) => {
                  return (
                    <Button
                      variant={
                        selectedTime === availableTime[time as "12" | "24"]
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleButtonClick(availableTime[time as "12" | "24"])
                      }
                      key={availableTime[time as "12" | "24"]}
                      // className={`${
                      //   selectedTime === availableTime[time as "12" | "24"]
                      //     ? "bg-primary text-white"
                      //     : "bg-white text-black"
                      // }`}
                    >
                      {availableTime[time as "12" | "24"]}
                    </Button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
