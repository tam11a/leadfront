import { Separator } from "@/components/ui/separator";
import MediaTable from "./table";

export default function Medias() {
  return (
    <div className="space-y-4 block">
      <div className="p-6 pb-1 flex flex-row items-center justify-between">
        <div className="space-y-0.5 p-6 pb-1">
          <h2 className="text-2xl font-bold tracking-tight">Medias</h2>
          <p className="text-muted-foreground text-sm">
            Here&apos;s a list of your medias!
          </p>
        </div>
        {/* <CreateMedia /> */}
      </div>
      <Separator />

      <div className="px-9">
        <MediaTable />
      </div>
    </div>
  );
}
