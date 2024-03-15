import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyUnitsList from "./unit-list";

export default function Units() {
  return (
    <div className="space-y-8">
      <CardHeader className="p-0">
        <CardTitle>Property Units</CardTitle>
        <CardDescription>Update your property unit options</CardDescription>
      </CardHeader>
      <PropertyUnitsList />
    </div>
  );
}
