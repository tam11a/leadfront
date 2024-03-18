"use client";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
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
import { FiActivity } from "react-icons/fi";

export function LogDialog({
	children,
	employeeId,
}: Readonly<{
	children?: React.ReactNode;
	employeeId: number;
}>) {
	const [open, setOpen] = useState(false);
	const { data } = useGetLog(open ? { user: employeeId } : undefined);
	return (
		<Dialog
			open={open}
			onOpenChange={(o) => setOpen(o)}
		>
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

						<DialogDescription className="flex flex-col items-center justify-center text-center gap-7 min-h-[280px] max-w-xs mx-auto">
							<FiActivity className="text-5xl mx-auto text-gray-400" />
							No recent activity detected. Please make sure the employee is
							active.
						</DialogDescription>

						{/* </>
            )} */}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
