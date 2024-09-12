"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import Link from "next/link";
import { useMemo, useState } from "react";

import { useGetSoldPropertyList } from "@/lib/actions/sold-properties/get-sold-property";

export interface Property {
  id: number;
  product_uid: string;
  product_typeName: string;
  areaName: string;
  size: string;
  unitName: string;
  price_public: string;
}

const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <div className="mx-4">ID</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("id")}</div>,
  },
  {
    id: "product_uid",
    accessorKey: "product_uid",
    header: () => {
      return <div className="mx-4">Title</div>;
    },
    cell: ({ row }) => (
      <Link href={`/properties/${row.original.id}`}>
        <Button variant={"link"} className="capitalize">
          {row.original.product_uid}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "product_typeName",
    header: () => {
      return <div className="mx-4">Type</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.getValue("product_typeName")}</div>
    ),
  },
  {
    accessorKey: "areaName",
    header: () => {
      return <div className="mx-4">Area</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("areaName")}</div>,
  },
  {
    accessorKey: "size",
    header: () => {
      return <div className="mx-4">Size</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">
        {row.original.size} {row.original.unitName}
      </div>
    ),
  },
  {
    accessorKey: "price_public",
    header: () => {
      return <div className="mx-4">Price</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.getValue("price_public")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => {
      return <div className="mx-4">Status</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "created_at",
    header: () => {
      return <div className="mx-4">Created At</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("created_at")}</div>,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const property = row.original;
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
              <Link href={`/properties/${property.id}`}>
                <DropdownMenuItem>View profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export default function SoldProperties({
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

  const { data } = useGetSoldPropertyList({
    search,
    customer_representative: params.id,
  });
  const table = useReactTable({
    data: useMemo(() => data?.data?.map((d: any) => d.property) || [], [data]),
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
      {/* <CardHeader className="p-0">
        <CardTitle>Assigned Properties</CardTitle>
        <CardDescription>
          Table of assigned properties of this Employee.
        </CardDescription>
      </CardHeader> */}
      <div className="flex items-center flex-row gap-2 py-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="max-w-sm"
        />
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
