import { Separator } from "@/components/ui/separator";
import PropertyTable from "./table";

export default function properties() {
  return (
    <div className="space-y-4 block">
      <div className="p-6 pb-1 flex flex-row items-center justify-between">
        <div className="space-y-0.5 p-6 pb-1">
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground text-sm">
            Here&apos;s a list of your properties!
          </p>
        </div>
        {/* <CreateProperties /> */}
      </div>
      <Separator />
      <div className="px-9">
        <PropertyTable />
      </div>
    </div>
  );
}
