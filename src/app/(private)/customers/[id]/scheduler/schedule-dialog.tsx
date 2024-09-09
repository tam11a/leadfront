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

export interface property {
  id: number;
  product_id: any;
  product_uid: string;
}

export function ScheduleDialog({
  date,
  timeZone,
  weeksInMonth,
  handleChangeAvailableTime,
  setProperty_id,
  customerId,
}: {
  date: DateValue;
  timeZone: string;
  weeksInMonth: number;
  setProperty_id: any;
  customerId: number;
  handleChangeAvailableTime: (time: string) => void;
}) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [tabValue, setTabValue] = useState("time");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dayNumber, dayName] = date
    .toDate(timeZone)
    .toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
    })
    .split(" ");

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
  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="ml-5">
          Add Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-[525px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Interested Property</DialogTitle>
          <DialogDescription>
            Select and add a new property that this customer is interested in.
          </DialogDescription>
        </DialogHeader>
        {tabValue === "time" ? (
          <>
            <Tabs
              defaultValue="12"
              className="flex flex-col gap-1 w-[260px] mx-auto"
            >
              <div>
                <p
                  aria-hidden
                  className="flex-1 align-center font-semibold text-md"
                >
                  {dayName} <span className="text-gray-11">{dayNumber}</span>
                </p>
              </div>
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
              <Button onClick={() => setTabValue("property")}>
                Find Property
              </Button>
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </>
        ) : (
          ""
        )}
      </DialogContent>
    </Dialog>
  );
}
