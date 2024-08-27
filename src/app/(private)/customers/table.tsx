"use client";

import {
  CaretSortIcon,
  CheckIcon,
  Cross2Icon,
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
  TableLoading,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useGetCustomers } from "@/lib/actions/customers/get-customers";
import { TbUserEdit } from "react-icons/tb";
import { UpdateCustomer } from "./update-customer";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  parseAsInteger,
  parseAsString,
  queryTypes,
  useQueryState,
  useQueryStates,
} from "nuqs";

import { CustomerStatusList } from "./create-customer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUser from "@/hooks/useUser";

import { Separator } from "@/components/ui/separator";
import { useMedia } from "@/lib/actions/media/use-media";
import { useDeleteCustomer } from "@/lib/actions/customers/delete-customers";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
import moment from "moment";

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  status: string;
  priority: string;
  source: string;
  email: string;
  phone: string;
  dob: string;
  bank_name?: string;
  bank_branch?: string;
  bank_account_number?: number;
  bank_routing_number?: number;
  address: string;
  address2?: string;
  zip_code: number;
  nid: number;
  is_active: boolean;
  followup: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  assigned_employee_id?: number;
  media_id?: number;
  project_id?: number;
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
    cell: ({ row }) => <div className="mx-4">{row.getValue("status")}</div>,
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
          <Badge variant={isActive ? "secondary" : "destructive"}>
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
          <UpdateCustomer customerId={customer.id}>
            <Button size={"icon"} variant={"ghost"}>
              <TbUserEdit />
            </Button>
          </UpdateCustomer>
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
                    `ID: ${customer.id?.toString()}\nFirst Name: ${
                      customer?.first_name
                    }\nLast Name: ${customer?.last_name}\nPhone: ${
                      customer.phone
                    }\nEmail: ${customer.email}`
                  )
                }
              >
                Copy Information
              </DropdownMenuItem> */}

              <Link href={`/customers/${customer.id}`}>
                <DropdownMenuItem>View profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DeleteCustomer id={customer.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

const DeleteCustomer: React.FC<{ id: number }> = ({ id }) => {
  const { mutateAsync: Delete, isPending: isDeleting } = useDeleteCustomer();

  async function onDelete(id: number) {
    const res = await handleResponse(() => Delete(id), 204);
    if (res.status) {
      toast("Deleted!", {
        description: `Customer has been deleted successfully.`,
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

export default function CustomerTable() {
  const { user, isLoading: userLoading } = useUser();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Search
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  });

  // Pagination
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true,
    })
  );

  // Filters
  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString.withDefault(""),
      media_id: parseAsString.withDefault(""),
      assigned_employee_id: parseAsString.withDefault(""),
    },
    {
      clearOnDefault: true,
    }
  );

  const { data, isLoading } = useGetCustomers({
    search,
    page,
    ...filters,
  });
  const { data: mediaData } = useMedia(search);

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
    <div className="w-full max-w-[85vw] lg:max-w-[70vw] mx-auto relative">
      <div className="flex items-center justify-between w-full md:w-auto flex-col md:flex-row gap-2 py-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="md:max-w-sm"
        />
        <span className="flex flex-row w-full md:w-auto justify-between items-center gap-2">
          <Select
            onValueChange={async (v) =>
              await setFilters((f) => {
                return { ...f, status: v };
              })
            }
            value={filters.status}
          >
            <SelectTrigger className="border-dashed gap-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {CustomerStatusList.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              <Separator />
              <Button
                variant="ghost"
                className="w-full mt-1 font-normal"
                onClick={async () =>
                  await setFilters((f) => {
                    return { ...f, status: "" };
                  })
                }
              >
                Clear filters
              </Button>
            </SelectContent>
          </Select>
          <Select
            onValueChange={async (v) =>
              await setFilters((f) => {
                return { ...f, media_id: v };
              })
            }
            value={filters.media_id}
          >
            <SelectTrigger className="border-dashed gap-1">
              <SelectValue placeholder="Media" />
            </SelectTrigger>
            <SelectContent>
              {mediaData?.data?.map((media: any) => (
                <SelectItem value={media?.id.toString()} key={media?.id}>
                  {`${media?.first_name} ${media?.last_name}`}
                </SelectItem>
              ))}
              <Separator />
              <Button
                variant="ghost"
                className="w-full mt-1 font-normal"
                onClick={async () =>
                  await setFilters((f) => {
                    return { ...f, media_id: "" };
                  })
                }
              >
                Clear filters
              </Button>
            </SelectContent>
          </Select>
          {Object.values(filters).some((v) => v !== "") && (
            <Button
              variant="ghost"
              onClick={async () => {
                await setFilters({
                  status: "",
                  assigned_employee_id: "",
                  media_id: "",
                });
              }}
              className="px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
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
        </span>
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
      </div>
    </div>
  );
}
