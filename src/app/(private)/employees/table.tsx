"use client";

import * as React from "react";
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
  // getPaginationRowModel,
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
  TableLoading,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEmployees } from "@/lib/actions/employees/users";
import { Badge } from "@/components/ui/badge";
import { UpdateEmployee } from "./update-employee";
import { TbUserEdit } from "react-icons/tb";
import { FiActivity } from "react-icons/fi";
import { LogDialog } from "./log-dialog";
import { CreateAccessDialog } from "./create-access";
import { parseAsInteger, useQueryState } from "nuqs";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
import { useDeleteEmployee } from "@/lib/actions/employees/delete-employees";
import Link from "next/link";

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  employee_uid: string;
  gender: string;
  email: string;
  phone: string;
  dob: string;
  work_hour: number;
  salary: number;
  bank_name?: string;
  bank_branch?: string;
  bank_account_number?: number;
  bank_routing_number?: number;
  address: string;
  address2?: null;
  zip_code: number;
  nid: number;
  tin?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user_id?: number;
}

export const columns: ColumnDef<Employee>[] = [
  // {
  // 	accessorKey: "id",
  // 	header: () => {
  // 		return <div className="mx-4">Id</div>;
  // 	},
  // 	cell: ({ row }) => <div className="mx-4">{row.getValue("id")}</div>,
  // },
  {
    accessorKey: "employee_uid",
    header: () => {
      return <div className="mx-4">Employee UID</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.getValue("employee_uid")}</div>
    ),
  },
  {
    id: "full_name",
    accessorKey: "full_name",
    header: () => {
      return <div className="mx-4">Full Name</div>;
    },
    cell: ({ row }) => (
      <div>
        <Link href={`/employees/${row.original.id}`}>
          <Button variant={"link"}>
            {row.original.first_name} {row.original.last_name}{" "}
          </Button>
        </Link>
        {!row.original.user_id && (
          <>
            <CreateAccessDialog
              email={row.original.email}
              employeeId={row.original.id}
            />
          </>
        )}
      </div>
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <>
        <div className="lowercase">{row.getValue("email")}</div>
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
      return <div className="mx-4">Daet Of Birth</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("dob")}</div>,
  },
  {
    accessorKey: "nid",
    header: () => {
      return <div className="mx-4">NID</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("nid") || "-"}</div>,
  },

  {
    accessorKey: "tin",
    header: () => {
      return <div className="mx-4">TIN</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("tin") || "-"}</div>,
  },
  {
    accessorKey: "salary",
    header: () => {
      return <div className="mx-4">Salary</div>;
    },
    cell: ({ row }) => (
      <div className="mx-4">{row.getValue("salary") || "-"}</div>
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
      return <div className="mx-4">Status</div>;
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
      const employee = row.original;
      return (
        <>
          <UpdateEmployee employeeId={employee.id}>
            <Button size={"icon"} variant={"ghost"}>
              <TbUserEdit />
            </Button>
          </UpdateEmployee>
          <LogDialog employeeId={employee.user_id}>
            <Button
              size={"icon"}
              variant={"ghost"}
              disabled={!employee.user_id}
            >
              <FiActivity />
            </Button>
          </LogDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `ID: ${employee.id?.toString()}\nFirst Name: ${
                      employee?.first_name
                    }\nLast Name: ${employee?.last_name}\nPhone: ${
                      employee.phone
                    }\nEmail: ${employee.email}`
                  )
                }
              >
                Copy Information
              </DropdownMenuItem> */}

              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteEmployee id={employee.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

const DeleteEmployee: React.FC<{ id: number }> = ({ id }) => {
  const { mutateAsync: Delete, isPending: isDeleting } = useDeleteEmployee();

  async function onDelete(id: number) {
    const res = await handleResponse(() => Delete(id), 204);
    if (res.status) {
      toast("Deleted!", {
        description: `Employee has been deleted successfully.`,
        closeButton: true,
        important: true,
      });
    } else {
      toast("Error!", {
        description: res.message,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onDelete(id),
        },
      });
    }
  }
  return (
    <>
      <DropdownMenuItem
        className="bg-red-500 focus:bg-red-400 text-white focus:text-white"
        onClick={() => onDelete(id)}
        disabled={isDeleting}
      >
        Delete Account
      </DropdownMenuItem>
    </>
  );
};

export default function EmployeeTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { data, isLoading } = useEmployees();

  const table = useReactTable({
    data: React.useMemo(() => data?.data || [], [data]),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full max-w-[85vw] lg:max-w-[70vw] mx-auto relative">
      <div className="flex items-center flex-row gap-2 py-4">
        <Input
          placeholder="Filter email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex">
              View
              <MixerHorizontalIcon className="ml-2 h-4 w-4" />
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
                    {column.id.split("_").join(" ")}
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

      {/* PAGINATION */}

      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {page} of {Math.ceil((data?.data?.count || 1) / 8)} page(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={!data?.data?.previous}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data?.data?.next}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}
