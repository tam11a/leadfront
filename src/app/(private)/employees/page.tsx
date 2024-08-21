import { Separator } from "@/components/ui/separator";
import EmployeeTable from "./table";
import { CreateEmployee } from "./create-employee";

export default function Customers() {
  return (
    <div className="space-y-4 block">
      <div className="p-6 pb-1 flex flex-row items-center justify-between">
        <div className="space-y-0.5 ">
          <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground text-sm">
            Here&apos;s a list of your employees!
          </p>
        </div>
        <CreateEmployee />
      </div>
      <Separator />

      <div className="px-9">
        <EmployeeTable />
      </div>
    </div>
  );
}
