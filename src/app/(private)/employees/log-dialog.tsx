"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetLog } from "@/lib/actions/auth/get-log";
import { useState } from "react";

export function LogDialog({
  children,
  employeeId,
}: Readonly<{
  children?: React.ReactNode;
  employeeId: number;
}>) {
  const [open, setOpen] = useState(false);
  const { data } = useGetLog(open ? { user: employeeId } : undefined);
  console.log(data);
  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        {children || <Button variant="outline">View Log</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Activity Log</DialogTitle>
          <DialogDescription>
            Activity log for employee #{employeeId}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="max-h-[75vh]">
            {/* {data ? (
              <>
                {data?.map((log: any) => (
                  <p key={log.id}>{log.user_name}</p>
                ))}
              </>
            ) : (
              <> */}

            <DialogDescription className="text-center sm:text-left">
              No recent activity detected. Please make sure the employee is
              active.
            </DialogDescription>

            {/* </>
            )} */}
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button>Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
