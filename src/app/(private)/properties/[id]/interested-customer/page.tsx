"use client";

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import {
  useGetInterests,
  useGetInterestsList,
} from "@/lib/actions/interests/get-interests";
import { CreateInterest } from "./create-interest";
import moment from "moment";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: number;
  name: string;
  priority: string;
  email: string;
  phone: string;
  followup: string;
  interest: number;
  customer_id: any;
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <div className="mx-4">ID</div>;
    },
    cell: ({ row }) => {
      return <div className="mx-4">{row.original?.customer_id?.id}</div>;
    },
  },
  {
    id: "full_name",
    accessorKey: "full_name",
    header: () => {
      return <div className="mx-4">Full Name</div>;
    },
    cell: ({ row }) => (
      <Link href={`/customers/${row.original?.customer_id?.id}`}>
        <Button variant={"link"} className="capitalize">
          {[
            row.original.customer_id?.first_name,
            row.original.customer_id?.last_name,
          ].join(" ")}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "phone",
    header: () => {
      return <div className="mx-4">Phone</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.original.customer_id?.phone}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => {
      return <div className="mx-4">Email</div>;
    },
    cell: ({ row }) => (
      <>
        <div className="lowercase mx-4">{row.original.customer_id?.email}</div>
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
        <div className="mx-4 capitalize">
          {row.original.customer_id?.address}
        </div>
      </>
    ),
  },
  {
    accessorKey: "gender",
    header: () => {
      return <div className="mx-4">Gender</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.original.customer_id?.gender}</div>
    ),
  },
  {
    accessorKey: "dob",
    header: () => {
      return <div className="mx-4">Date Of Birth</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.original.customer_id?.dob}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: () => {
      return <div className="mx-4">Priority</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.original.customer_id?.priority}</div>
    ),
  },
  {
    accessorKey: "source",
    header: () => {
      return <div className="mx-4">Source</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.original.customer_id?.source}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => {
      return <div className="mx-4">Status</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4 capitalize">
        <Badge variant={row.original.customer_id?.status}>
          {row.original.customer_id?.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "media_commision",
    header: () => {
      return <div className="mx-4">Media Commision (৳)</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">
        {row.original.customer_id?.media_commision ? (
          <>{row.original.customer_id?.media_commision}</>
        ) : (
          "-"
        )}{" "}
      </div>
    ),
  },
  // {
  //   id: "media",
  //   accessorKey: "full_name",
  //   header: () => {
  //     return <div className="mx-4">Media</div>;
  //   },
  //   cell: ({ row }) => (
  //     <Link href={`/customers/${row.original.id}`}>
  //       <Button variant={"link"}>
  //         {row.original.first_name} {row.original.last_name}
  //       </Button>
  //     </Link>
  //   ),
  // },
  {
    accessorKey: "followup",
    header: () => {
      return <div className="mx-4">Followup</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">
        {row.original.customer_id?.followup ? (
          <>{moment(row.original.customer_id?.followup).format("llll")}</>
        ) : (
          "No date added yet"
        )}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: () => {
      return <div className="mx-4">Created At</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.original.customer_id?.created_at}</div>
    ),
  },
  {
    accessorKey: "is_active",
    header: () => {
      return <div className="mx-4">Account status</div>;
    },
    cell: ({ row }) => {
      const isActive = row.original.customer_id?.is_active;
      return (
        <div className="mx-4">
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },
];

// const DeleteInterestedCustomer: React.FC<{ id: number }> = ({ id }) => {
//   const { mutateAsync: Delete, isPending: isDeleting } = useDeleteInterest();

//   async function onDelete(id: number) {
//     const res = await handleResponse(() => Delete(id), 204);

//     if (res.status) {
//       toast("Deleted!", {
//         description: `Interest has been deleted successfully.`,
//         closeButton: true,
//         important: true,
//       });
//     } else {
//       toast("Error!", {
//         description: res.message,
//         important: true,
//         action: {
//           label: "Retry",
//           onClick: () => onDelete(id),
//         },
//       });
//     }
//   }
//   return (
//     <>
//       <DropdownMenuItem
//         className="bg-red-500 focus:bg-red-400 text-white focus:text-white"
//         onClick={() => onDelete(id)}
//         disabled={isDeleting}
//       >
//         Remove Interest
//       </DropdownMenuItem>
//     </>
//   );
// };

export default function InterestedCustomersTable({
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

  const { data } = useGetInterestsList({
    product_id: params?.id,
  });
  const table = useReactTable({
    data: useMemo(() => data?.data || [], [data]),
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
        <CreateInterest
          id={+params.id}
          ignoreCustomer={data?.data?.map((d: any) => d.id)}
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
