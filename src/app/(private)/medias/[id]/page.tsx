"use client";

import {
  CaretSortIcon,
  DotsHorizontalIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetCustomers } from "@/lib/actions/customers/get-customers";
import Link from "next/link";
import { useMemo, useState } from "react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  status: string;
  email: string;
  assigned_employee_id: number;
  phone: string;
  followup: string;
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <div className="mx-4">ID</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("id")}</div>,
  },
  {
    id: "full_name",
    accessorKey: "full_name",
    header: () => {
      return <div className="mx-4">Full Name</div>;
    },
    cell: ({ row }) => (
      <Link href={`/customers/${row.original.id}`}>
        <Button variant={"link"}>
          {row.original.first_name} {row.original.last_name}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "phone",
    header: () => {
      return <div className="mx-4">Phone</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "email",
    header: () => {
      return (
        // <Button
        //   variant="ghost"
        //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        // >
        <div className="mx-4">Email</div>
        //   <CaretSortIcon className="ml-2 h-4 w-4" />
        // </Button>
      );
    },
    cell: ({ row }) => (
      <>
        <div className="lowercase">{row.getValue("email")}</div>
      </>
    ),
  },
  {
    accessorKey: "address",
    header: () => {
      return <div className="mx-4">Address</div>;
    },
    cell: ({ row }) => (
      <>
        <div className="lowercase">{row.getValue("address")}</div>
      </>
    ),
  },
  {
    accessorKey: "gender",
    header: () => {
      return <div className="mx-4">Gender</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "dob",
    header: () => {
      return <div className="mx-4">Date Of Birth</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("dob")}</div>,
  },
  {
    accessorKey: "priority",
    header: () => {
      return <div className="mx-4">Priority</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("priority")}</div>,
  },
  {
    accessorKey: "source",
    header: () => {
      return <div className="mx-4">Source</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("source")}</div>,
  },
  {
    accessorKey: "status",
    header: () => {
      return <div className="mx-4">Status</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">
        <Badge variant={row.getValue("status")}>{row.getValue("status")}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "followup",
    header: () => {
      return <div className="mx-4">Followup</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">
        {moment(row.getValue("followup")).format("llll")}
      </div>
    ),
  },
  {
    accessorKey: "assigned_employee_name",
    header: () => {
      return <div className="mx-4">Assigned to</div>;
    },
    cell: ({ row }) => (
      <Link href={`/employees/${row.original.assigned_employee_id}`}>
        <Button variant={"link"}>
          {row.getValue("assigned_employee_name")}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => {
      return <div className="mx-4">Created At</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("created_at")}</div>,
  },
  {
    accessorKey: "is_active",
    header: () => {
      return <div className="mx-4">Account status</div>;
    },
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      return (
        <div className="mx-4">
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `ID: ${customer.id?.toString()}\nFirst Name: ${
                      customer?.first_name
                    }\nLast Name: ${customer?.last_name}\nPhone: ${
                      customer.phone
                    }\nEmail: ${customer.email}`
                  )
                }
              >
                Copy Information
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <Link href={`/customers/${customer.id}`}>
                <DropdownMenuItem>View profile</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default function MediaCustomersTable({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [search, setSearch] = useState<string>("");

  const { data } = useGetCustomers({
    search,
    media_id: params?.id,
  });
  const table = useReactTable({
    data: useMemo(() => data?.data?.results || [], [data]),
    columns,
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
    <div className="w-full max-w-[80vw] md:max-w-[60vw] lg:max-w-[70vw] mx-auto relatives">
      <div className="flex items-center flex-row gap-2 py-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              View <MixerHorizontalIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
            {table.getRowModel().rows?.length ? (
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
