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
        router.push(`/medias/${pathname.split("/")?.[2]}/${value}`);
      }}
    >
      <TabsList>
        <TabsTrigger value="">Customers</TabsTrigger>
        <TabsTrigger value="properties">Properties</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
