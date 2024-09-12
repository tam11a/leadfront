"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { availableTimes } from "./available-times";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { useGetInterestsList } from "@/lib/actions/interests/get-interests";
import { useCreateSchedule } from "@/lib/actions/schedule/post-schedule";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import { Badge } from "@/components/ui/badge";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import moment from "moment";

export interface property {
  id: number;
  product_id: any;
  product_uid: string;
}

export function ScheduleDialog({
  date,
  timeZone,
  weeksInMonth,
  // handleChangeAvailableTime,
  customerId,
}: {
  date: DateValue;
  timeZone: string;
  weeksInMonth: number;
  customerId: number;
  // handleChangeAvailableTime: (time: string) => void;
}) {
  const { locale } = useLocale();
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [property_id, setProperty_id] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [tabValue, setTabValue] = useState("time");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { data: customerData } = useGetCustomerById(customerId);

  const [dayNumber, dayName] = date
    .toDate(timeZone)
    .toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
    })
    .split(" ");

  const handleChangeAvailableTime = (time: string) => {
    const timeValue = time.split(":").join(" ");

    const match = timeValue.match(/^(\d{1,2}) (\d{2})([ap]m)?$/i);
    if (!match) {
      return null;
    }

    let hours = Number.parseInt(match[1]);

    const minutes = Number.parseInt(match[2]);
    const isPM = match[3] && match[3].toLowerCase() === "pm";

    if (isPM && (hours < 1 || hours > 12)) {
      return null;
    }

    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    const currentDate = date.toDate(timeZone);
    currentDate.setHours(hours, minutes);
    setScheduleDate(currentDate.toISOString());
  };

  const handleButtonClick = (time: string) => {
    setSelectedTime(time);
    handleChangeAvailableTime(time);
  };
  //data
  const { data, isLoading } = useGetInterestsList({
    customer_id: customerId,
  });
  const columns: ColumnDef<property>[] = [
    {
      id: "select",
      cell: ({ row }) => {
        const property = row?.original?.product_id?.id;
        return (
          <>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value), setProperty_id(property);
              }}
              disabled={row?.original?.product_id?.status === "sold"}
              aria-multiselectable="false"
              aria-label="Select row"
            />
          </>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => {
        return <div className="mx-4">ID</div>;
      },
      cell: ({ row }) => {
        const property_id = row?.original?.product_id?.id;
        return <div className="mx-4">{property_id}</div>;
      },
    },
    {
      accessorKey: "product_uid",
      header: () => {
        return <div className="mx-4">Property Name</div>;
      },
      cell: ({ row }) => {
        const property_name = row?.original?.product_id?.product_uid;
        return <div className="mx-4">{property_name}</div>;
      },
    },
    {
      accessorKey: "status",
      header: () => {
        return <div className="mx-4">Status</div>;
      },
      cell: ({ row }) => {
        const status = row?.original?.product_id?.status;
        return (
          <Badge className="mx-4 capitalize" variant={status}>
            {status}
          </Badge>
        );
      },
    },
  ];

  //Interest submit
  const table = useReactTable({
    data: useMemo(() => data?.data || [], [data]),
    columns,
    enableMultiRowSelection: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const { mutateAsync: createSchedule } = useCreateSchedule();
  async function onScheduleSubmit() {
    const res = await handleResponse(
      () =>
        createSchedule({
          visit_schedule: scheduleDate,
          customer_id: customerId,
          employee_id: user?.id,
          property_id: property_id,
        }),
      [201]
    );
    if (res.status) {
      toast("Added!", {
        description: `Schedule has been created successfully.`,
        important: true,
      });
      setProperty_id("");
      setOpen(false);
      setScheduleDate("");
      setTabValue("time");
    } else {
      toast("Error!", {
        description: res.message,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onScheduleSubmit(),
        },
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        {moment(`${date.year}-${date.month}-${date.day}`).diff(
          moment(),
          "day"
        ) >= 0 ? (
          <Button
            onClick={() => setOpen(true)}
            className="lg:ml-5"
            disabled={
              customerData?.data?.status === "sold" ||
              customerData?.data?.status === "junks"
            }
          >
            Add Schedule
          </Button>
        ) : (
          ""
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-[525px] rounded-lg">
        <DialogHeader>
          <DialogTitle>
            Add Schedule on {dayName}, {dayNumber}{" "}
          </DialogTitle>
          <DialogDescription>
            Select the preffered time and property to create a schedule
          </DialogDescription>
        </DialogHeader>
        {tabValue === "time" ? (
          <>
            <Tabs
              defaultValue="12"
              className="flex flex-col gap-1 w-[260px] mx-auto"
            >
              {["12", "24"].map((time) => (
                <TabsContent key={time} value={time}>
                  <ScrollArea
                    type="always"
                    className="h-full "
                    style={{
                      maxHeight: weeksInMonth > 5 ? "380px" : "320px",
                    }}
                  >
                    <div className="flex flex-col max-h-64 pr-3">
                      <div className="grid gap-2 pr-3">
                        {availableTimes.map((availableTime) => {
                          return (
                            <Button
                              variant={
                                selectedTime ===
                                availableTime[time as "12" | "24"]
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                handleButtonClick(
                                  availableTime[time as "12" | "24"]
                                )
                              }
                              key={availableTime[time as "12" | "24"]}
                              // className={`${
                              //   selectedTime === availableTime[time as "12" | "24"]
                              //     ? "bg-primary text-white"
                              //     : "bg-white text-black"
                              // }`}
                            >
                              {availableTime[time as "12" | "24"]}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
            <DialogFooter className="mt-4">
              <Button onClick={() => setTabValue("property")}>Next</Button>
            </DialogFooter>
          </>
        ) : tabValue === "property" ? (
          <>
            <ScrollArea className="relative max-w-full whitespace-nowrap rounded-md border">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <TableLoading />
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button
                type="submit"
                onClick={() => setTabValue("time")}
                variant={"outline"}
              >
                Back
              </Button>
              <Button type="submit" onClick={() => onScheduleSubmit()}>
                Create
              </Button>
            </DialogFooter>
          </>
        ) : (
          ""
        )}
      </DialogContent>
    </Dialog>
  );
}
