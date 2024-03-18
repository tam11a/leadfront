import { Separator } from "@/components/ui/separator";
import Sidebar from "./details-sidebar";

export default function Details({ params }: { params: { id: number } }) {
  return (
    <div className="space-y-4 block">
      <div className="flex flex-row items-start space-x-8 lg:space-y-0 px-6 h-full">
        <aside className="w-1/5">
          <Sidebar id={params.id} />
        </aside>
        <div>
          <p>main content</p>
        </div>
      </div>
      <Separator orientation="vertical" />
    </div>
  );
}
