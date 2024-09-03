"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { useCreateProductsInterest } from "@/lib/actions/interests/post-products-interest";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";
import { useGetProductsFilter } from "@/lib/actions/interests/get-products-filter";
import { useGetAreas } from "@/lib/actions/configuration/areas/get-areas";
import { useGetPropertyTypes } from "@/lib/actions/configuration/property-types/get-property-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetPropertyUnits } from "@/lib/actions/configuration/property-units/get-property-units";
import Selection from "@/components/ui/selection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateCustomerComment } from "@/lib/actions/customer-logs/post-customer-comment";

export interface property {
  id: number;
  first_name: string;
  last_name: string;
}

const CreateInterestSchema = z.object({
  customer_id: z.number(),
  note: z.any().optional(),
  // product_id: z.number(),
  employee_id: z.number(),
});

type InterestFormValues = z.infer<typeof CreateInterestSchema>;

export function CreateInterest({
  id,
  ignoreProperties = [],
}: Readonly<{ id: number; ignoreProperties?: number[] }>) {
  //states
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState<string | null>("");
  const [propertyId, setPropertyId] = useState<number | null>();
  const [propertyType, setPropertyType] = useState("");
  const [unit, setUnit] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [minSize, setMinSize] = useState("");
  const [tabValue, setTabValue] = useState("filter");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [saveFilterData, setSaveFilterData] = useState({});
  const [areaName, setAreaName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [propertyTypeName, setPropertyTypeName] = useState("");

  //api calls
  const { access, user } = useUser();
  const { data: areaData } = useGetAreas();
  const { data: unitData, isLoading: isUnitDataLoading } =
    useGetPropertyUnits();
  const { data: propertyTypeData, isLoading: isPropertyTypeDataLoading } =
    useGetPropertyTypes();
  const { data: propertyfilteredData, isLoading: ispropertyFilteredLoading } =
    useGetProductsFilter({
      area: area,
      product_type: propertyType,
      price_public__gte: maxPrice,
      price_public__lte: minPrice,
      size__gte: maxSize,
      size__lte: minSize,
      unit: unit,
    });
  const { mutateAsync: create, isPending } = useCreateProductsInterest();
  const { mutateAsync: createSaveFilter } = useCreateCustomerComment();
  //data
  const columns: ColumnDef<property>[] = [
    {
      id: "select",
      cell: ({ row }) => {
        const property = row.original.id;
        return (
          <>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value),
                  setPropertyId(property),
                  setTabValue("details");
              }}
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
      cell: ({ row }) => <div className="mx-4">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "product_uid",
      header: () => {
        return <div className="mx-4">Property Name</div>;
      },
      cell: ({ row }) => (
        <div className="mx-4">{row.getValue("product_uid")}</div>
      ),
    },
  ];

  //Interest submit
  const form = useForm<InterestFormValues>({
    resolver: zodResolver(CreateInterestSchema),
    defaultValues: {
      note: "",
      customer_id: id,
      employee_id: user?.user?.id,
    },
    mode: "onChange",
  });

  async function onSubmit(data: InterestFormValues) {
    form.clearErrors();
    const res = await handleResponse(
      () => create({ ...data, product_id: propertyId }),
      [201]
    );
    if (res.status) {
      toast("Added!", {
        description: `Interested customer has been created successfully.`,
        important: true,
      });
      form.reset();
      setArea("");
      setPropertyType("");
      setPropertyId(null);
      setUnit("");
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof InterestFormValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error adding interested customer. Please try again.`,
          important: true,
          action: {
            label: "Retry",
            onClick: () => onSubmit(data),
          },
        });
      } else {
        toast("Error!", {
          description: res.message,
          important: true,
          action: {
            label: "Retry",
            onClick: () => onSubmit(data),
          },
        });
      }
    }
  }

  //Log Submit

  //data decoration
  useEffect(() => {
    setAreaName(
      areaData?.data
        ?.filter((x: any) => area?.includes(x.id))
        .map((d: any) => d.area_name)
    ),
      setUnitName(
        unitData?.data
          ?.filter((x: any) => unit?.includes(x.id))
          .map((d: any) => d.unit_name)
      ),
      setPropertyTypeName(
        propertyTypeData?.data
          ?.filter((x: any) => propertyType?.includes(x.id))
          .map((d: any) => d.product_type_name)
      ),
      setSaveFilterData(
        `Area: ${area === "" || area === null ? "N/A" : areaName},
Property type: ${
          propertyType === "" || propertyType === null
            ? "N/A"
            : propertyTypeName
        },
Unit: ${unit === "" || unit === null ? "N/A" : unitName},
Highest Price: ${maxPrice === "" || maxPrice === null ? "N/A" : maxPrice},
Lowest Price: ${minPrice === "" || minPrice === null ? "N/A" : minPrice},
Maximum Size: ${maxSize === "" || maxSize === null ? "N/A" : maxSize},
Minimum Size: ${minSize === "" || minSize === null ? "N/A" : minSize},`
      );
  }, [propertyfilteredData]);

  async function onSaveFilter() {
    const res = await handleResponse(
      () =>
        createSaveFilter({
          name: access?.data?.username,
          note: saveFilterData,
          type: 5,
          customer_id: id,
          employee_id: user?.user?.id,
          description: "saved filter data",
        }),
      [201]
    );
    if (res.status) {
      toast("Added!", {
        description: `Filter Data has been Saved successfully.`,
        important: true,
      });
    } else {
      toast("Error!", {
        description: res.message,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onSaveFilter(),
        },
      });
    }
  }

  const table = useReactTable({
    data: useMemo(
      () =>
        propertyfilteredData?.data?.filter(
          (v: any) =>
            v?.status !== "sold" &&
            v?.status !== "junk" &&
            !ignoreProperties.includes(v.id)
        ) || [],

      [propertyfilteredData]
    ),
    columns,
    onSortingChange: setSorting,
    enableMultiRowSelection: false,
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
        <Button onClick={() => setOpen(true)}>Add Interest</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-[525px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Interested Property</DialogTitle>
          <DialogDescription>
            Select and add a new property that this customer is interested in.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={tabValue}
          className="w-auto"
          onValueChange={(v) => setTabValue(v)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filter">Filter</TabsTrigger>
            <TabsTrigger value="property">Properties</TabsTrigger>
            {/* <TabsTrigger value="details">Details</TabsTrigger> */}
          </TabsList>
          <TabsContent value="filter" className="min-h-80">
            <div className="flex flex-col py-2">
              <Label className="pb-2">Area</Label>
              <Selection
                options={areaData?.data?.flatMap((d: any) => ({
                  label: d?.area_name,
                  value: d?.id?.toString(),
                }))}
                value={area}
                onChange={(v) => setArea(v)}
                allowClear
              />
            </div>
            <div className="flex flex-row items-start gap-3 pb-2">
              <div className="flex flex-col flex-1">
                <Label className="py-2">Property type</Label>
                <Select
                  value={propertyType}
                  onValueChange={(v) => setPropertyType(v)}
                  disabled={isPropertyTypeDataLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypeData?.data?.map((d: any) => (
                      <SelectItem value={d?.id?.toString()} key={d?.id}>
                        {d?.product_type_name}
                      </SelectItem>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full mt-1 font-normal"
                      onClick={() => setPropertyType("")}
                    >
                      Clear filters
                    </Button>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col flex-1">
                <Label className="py-2">Unit</Label>
                <Select
                  value={unit}
                  onValueChange={(v) => setUnit(v)}
                  disabled={isUnitDataLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitData?.data?.map((d: any) => (
                      <SelectItem value={d?.id?.toString()} key={d?.id}>
                        {d?.unit_name}
                      </SelectItem>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full mt-1 font-normal"
                      onClick={() => setUnit("")}
                    >
                      Clear filters
                    </Button>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-row items-start gap-3 pb-2">
              <div className="flex flex-col flex-1">
                <Label className="py-2">Highest Price</Label>
                <Input
                  placeholder="Enter an amount in bdt"
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                  }}
                  className="max-w-sm mt-1"
                />
              </div>
              <div className="flex flex-col flex-1">
                <Label className="py-2">Lowest Price</Label>
                <Input
                  placeholder="Enter an amount in bdt"
                  value={minPrice}
                  onChange={(event) => {
                    setMinPrice(event.target.value);
                  }}
                  className="max-w-sm mt-1"
                />
              </div>
            </div>
            <div className="flex flex-row items-start gap-3 pb-2">
              <div className="flex flex-col flex-1">
                <Label className="py-2">Maximum Size</Label>
                <Input
                  placeholder="Enter maximum size of the property"
                  value={maxSize}
                  onChange={(event) => {
                    setMaxSize(event.target.value);
                  }}
                  className="max-w-sm mt-2"
                />
              </div>
              <div className="flex flex-col flex-1">
                <Label className="py-2">Minimum Size</Label>
                <Input
                  placeholder="Enter minimum size of the property"
                  value={minSize}
                  onChange={(event) => {
                    setMinSize(event.target.value);
                  }}
                  className="max-w-sm mt-2"
                />
              </div>
            </div>
            <DialogFooter className="mt-3">
              <Button disabled={isPending} onClick={() => onSaveFilter()}>
                Save
              </Button>
              <Button
                disabled={isPending}
                onClick={() => setTabValue("property")}
              >
                Find Property
              </Button>
            </DialogFooter>
          </TabsContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3  px-1"
            >
              <TabsContent value="property" className="min-h-80">
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
                      {ispropertyFilteredLoading ? (
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
              </TabsContent>
              <TabsContent value="details">
                {/* <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Input property price.."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Input note or remarks.."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isPending}>
                    Save
                  </Button>
                </DialogFooter>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
