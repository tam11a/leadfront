import { Separator } from "@/components/ui/separator";
import { Scheduler } from "./scheduler";

export default function Schedules({
  params,
}: {
  params: {
    id: number;
  };
}) {
  return (
    <div className="space-y-4 block">
      <div className="pb-1 flex flex-row items-center justify-between">
        <div className="space-y-0.5 p-1">
          {/* <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground text-sm">
            Here&apos;s a list of your customers!
          </p> */}
          <div className="py-6">
            <Scheduler params={params} />
          </div>
        </div>
      </div>
    </div>
  );
}
