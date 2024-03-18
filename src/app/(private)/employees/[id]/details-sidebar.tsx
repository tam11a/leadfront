"use client";

import { Separator } from "@/components/ui/separator";
import { useEmployeeById } from "@/lib/actions/employees/get-by-id";

export default function Sidebar({ id }: { id: number }) {
  const { data } = useEmployeeById(id);
  console.log(data);
  return <div>{id} dawdha adhakwjd adhakjwdh wdakjwdakhwdjadka dajhdkajdh</div>;
}
