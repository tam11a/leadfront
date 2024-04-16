"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export default function TabNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Tabs
      value={pathname.split("/")?.[3] || ""}
      onValueChange={(value) => {
        router.push(`/properties/${pathname.split("/")?.[2]}/${value}`);
      }}
    >
      <TabsList>
        <TabsTrigger value="">Property Info</TabsTrigger>
        <TabsTrigger value="interested-customer">Interested</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
