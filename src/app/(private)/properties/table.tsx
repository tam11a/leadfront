"use client";

import * as React from "react";
import {
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
import { TbHomeEdit } from "react-icons/tb";
import Link from "next/link";
import { useGetProducts } from "@/lib/actions/properties/get-products";
import { UpdateProperty } from "./update-property";
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMedia } from "@/lib/actions/media/use-media";
import { Separator } from "@/components/ui/separator";
import { useGetPropertyTypes } from "@/lib/actions/configuration/property-types/get-property-types";
import { useDeleteProperty } from "@/lib/actions/properties/delete-properties";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export interface Property {
  id: number;
  product_uid: string;
  product_typeName: string;
  areaName: string;
  adress: string;
  size: string;
  unitName: string;
  price_public: string;
}
const CustomerStatusList = [
  {
    label: "Available",
    value: "available",
  },
  {
    label: "Booked",
    value: "booked",
  },
  {
    label: "Sold",
    value: "sold",
  },
  {
    label: "Junk",
    value: "junk",
  },
];

export const columns: ColumnDef<Property>[] = [
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
    accessorKey: "adress",
    header: () => {
      return <div className="mx-4">Address</div>;
    },
    cell: ({ row }) => <div className="mx-4">{row.getValue("adress")}</div>,
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
    cell: ({ row }) => (
      <div className="mx-4 capitalize">
        <Badge variant={row.getValue("status")}>{row.getValue("status")}</Badge>
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const property = row.original;
      return (
        <>
          <UpdateProperty propertyId={property.id}>
            <Button size={"icon"} variant={"ghost"}>
              <TbHomeEdit />
            </Button>
          </UpdateProperty>
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
                    `ID: ${property.id?.toString()}\nTitle: ${
                      property?.product_uid
                    }\nProperty Type: ${property?.product_typeName}\nArea: ${
                      property.product_typeName
                    }\nSize: ${property.size} ${property.unitName}\nPrice: ${
                      property.price_public
                    } ৳\n`
                  )
                }
              >
                Copy Information
              </DropdownMenuItem> */}

              <Link href={`/properties/${property.id}`}>
                <DropdownMenuItem>View profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DeleteProperties id={property.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

const DeleteProperties: React.FC<{ id: number }> = ({ id }) => {
  const { mutateAsync: Delete, isPending: isDeleting } = useDeleteProperty();

  async function onDelete(id: number) {
    const res = await handleResponse(() => Delete(id), 204);
    if (res.status) {
      toast("Deleted!", {
        description: `Property has been deleted successfully.`,
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
        Delete Property
      </DropdownMenuItem>
    </>
  );
};

export default function PropertyTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
      media_id: parseAsString.withDefault(""),
      product_type: parseAsString.withDefault(""),
      status: parseAsString.withDefault(""),
    },
    {
      clearOnDefault: true,
    }
  );
  const { data, isLoading } = useGetProducts({ search, page, ...filters });
  const { data: prodTypeData } = useGetPropertyTypes();
  const { data: mediaData } = useMedia(search);
  const table = useReactTable({
    data: React.useMemo(() => data?.data?.results || [], [data]),
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
    <div className="w-full max-w-[85vw] lg:max-w-[70vw] mx-auto relatives">
      <div className="flex items-center flex-col md:flex-row gap-2 py-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="max-w-sm"
        />
        <span className="flex flex-row w-full md:w-auto items-center gap-2 ml-auto">
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
                return { ...f, product_type: v };
              })
            }
            value={filters.product_type}
          >
            <SelectTrigger className="border-dashed gap-1">
              <SelectValue placeholder="Type	" />
            </SelectTrigger>
            <SelectContent>
              {prodTypeData?.data?.map((type: any) => (
                <SelectItem value={type?.id.toString()} key={type?.id}>
                  {type?.product_type_name}
                </SelectItem>
              ))}
              <Separator />
              <Button
                variant="ghost"
                className="w-full mt-1 font-normal"
                onClick={async () =>
                  await setFilters((f) => {
                    return { ...f, product_type: "" };
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
                  media_id: "",
                  product_type: "",
                  status: "",
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
              <Button variant="outline">
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
