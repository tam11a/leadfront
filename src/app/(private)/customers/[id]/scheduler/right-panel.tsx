import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocale } from "@react-aria/i18n";
import { useSearchParams } from "next/navigation";

export function RightPanel({}: {}) {
  const { locale } = useLocale();

  const searchParams = useSearchParams();
  const slotParam = searchParams.get("slot");

  return (
    <div className="flex flex-col gap-4 w-[280px] border-l pl-6">
      <div className="grid gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <img
              alt="Shadcn Cal"
              src="/avatar.jpeg"
              className="rounded-full border"
              width={24}
              height={24}
            />
          </TooltipTrigger>
          <TooltipContent>Shadcn Cal</TooltipContent>
        </Tooltip>
        <p className="text-gray-11 text-sm font-semibold">Shadcn Cal</p>
      </div>
      <div className="grid gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm font-semibold">Cal video</p>
          </TooltipTrigger>
          <TooltipContent>Cal video</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
