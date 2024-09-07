"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { availableTimes } from "./available-times";
import { Label } from "@/components/ui/label";

export function RightPanel({
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
  const [dayNumber, dayName] = date
    .toDate(timeZone)
    .toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
    })
    .split(" ");
  return (
    <Tabs
      defaultValue="12"
      className="flex flex-col gap-4 w-[280px] border-l pl-8"
    >
      <Label>Select Customers Preffered Time</Label>
      {["12", "24"].map((time) => (
        <TabsContent key={time} value={time}>
          <ScrollArea
            type="always"
            className="h-full "
            style={{
              maxHeight: weeksInMonth > 5 ? "380px" : "320px",
            }}
          >
            <div className="flex flex-col h-56 pr-3">
              <div className="grid gap-2 pr-3">
                {availableTimes.map((availableTime) => (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleChangeAvailableTime(
                        availableTime[time as "12" | "24"]
                      )
                    }
                    key={availableTime[time as "12" | "24"]}
                  >
                    {availableTime[time as "12" | "24"]}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
