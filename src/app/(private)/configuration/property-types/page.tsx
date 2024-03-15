import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyTypesList from "./types-list";

export default function Types() {
  return (
    <div className="space-y-8">
      <CardHeader className="p-0">
        <CardTitle>Property Types</CardTitle>
        <CardDescription>Update your property type options</CardDescription>
      </CardHeader>
      <PropertyTypesList />
    </div>
  );
}
