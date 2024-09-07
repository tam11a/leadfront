import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale } from "@react-aria/i18n";
import { useSearchParams } from "next/navigation";

export function RightPanel({ scheduleDate }: { scheduleDate: string }) {
  return (
    <div className="flex flex-col gap-4 w-[280px] border-l pl-6">
      <div className="grid gap-1">
        <p className="text-gray-11 text-sm font-semibold">{scheduleDate}</p>
      </div>
      <div className="grid gap-3 border-2 p-6 rounded">
        <p>Schedules</p>
      </div>
    </div>
  );
}
