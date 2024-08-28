"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function FollowupsToday({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      {data?.map((d: any) => (
        <div className="flex items-center" key={d.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage alt="Avatar" />
            <AvatarFallback>
              {[d.first_name.slice(0, 1), d.last_name.slice(0, 1)].join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {[d.first_name, d.last_name].join(" ")}
            </p>
            <p className="text-xs text-primary underline font-medium">
              <Link href={`/customers/${d.id}`}>View Details</Link>
            </p>
          </div>
          <div className="ml-auto font-medium">#{d.id}</div>
        </div>
      ))}
    </div>
  );
}
