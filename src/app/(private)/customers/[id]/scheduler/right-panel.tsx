"use client";

import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { useDeleteSchedule } from "@/lib/actions/schedule/delete-schedule";
import handleResponse from "@/lib/handle-response";
import moment from "moment";
import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";
import { TbBuildingCommunity } from "react-icons/tb";
import { toast } from "sonner";

export function RightPanel({ scheduleData }: { scheduleData: any }) {
	console.log(scheduleData);
	const { mutateAsync: Delete, isPending: isDeleting } = useDeleteSchedule();
	async function onDelete(Iid: number) {
		const res = await handleResponse(() => Delete(Iid), 204);
		if (res.status) {
			toast("Deleted!", {
				description: `Schedule has been deleted successfully.`,
				closeButton: true,
				important: true,
			});
		} else {
			toast("Error!", {
				description: res.message,
				important: true,
				action: {
					label: "Retry",
					onClick: () => onDelete(Iid),
				},
			});
		}
	}
	return (
		<>
			{!scheduleData?.data.length ? (
				<div className="flex flex-col items-center justify-center min-w-[300px] w-full min-h-[200px]">
					<CardDescription>No schedule added yet.</CardDescription>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-4 flex-1 lg:pl-4">
						{scheduleData?.data?.map((d: any) => (
							<div
								className="border rounded-md p-4"
								key={d.id}
							>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold text-muted-foreground">
											Schedule Details #{d?.id}
										</p>
										<Button
											variant={"outline"}
											size={"icon"}
											onClick={() => onDelete(d?.id)}
											className="text-destructive"
										>
											<MdOutlineDelete />
										</Button>
									</div>
									<h1 className="flex items-center font-bold gap-1 text-primary">
										<TbBuildingCommunity />
										<Link href={`/properties/${d.property_id?.id}`}>
											{d?.property_id?.product_uid}
										</Link>
									</h1>
									<div>
										<p className="text-sm text-muted-foreground ">
											Address : {d?.property_id?.adress}
										</p>
										<p className="text-sm text-muted-foreground">
											Schedule Time : {moment(d?.visit_schedule).format("lll")}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
}
