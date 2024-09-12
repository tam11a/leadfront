import { cn } from "@/lib/utils";
import {
  type CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday,
} from "@internationalized/date";
import { useCalendarCell } from "@react-aria/calendar";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";

export function CalendarCell({
  state,
  date,
  currentMonth,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date, isDisabled: false }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  const isDateToday = isToday(date, getLocalTimeZone());
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <td
      {...cellProps}
      className={cn("py-0.5 relative px-0.5", isFocusVisible ? "z-10" : "z-0")}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className="size-10 text-gray-700 group rounded-md"
      >
        <div
          className={cn(
            "size-full rounded-md flex items-center justify-center",
            "text-card-foreground text-sm font-semibold",
            isDisabled
              ? isDateToday
                ? "cursor-defaut"
                : "text-muted-foreground cursor-defaut"
              : "cursor-pointer bg-transparent",
            // Darker selection background for the start and end.
            isSelected && "border-none bg-primary text-slate-300",
            // Hover state for non-selected cells.
            !isSelected && !isDisabled && "hover:ring-2 hover:ring-gray-12"
            // isDateToday && "bg-gray-200  ring-0 ring-offset-0"
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2 size-1.5 bg-gray-12 rounded-full"
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
