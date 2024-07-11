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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetAreas } from "@/lib/actions/configuration/areas/get-areas";
import { useGetPropertyTypes } from "@/lib/actions/configuration/property-types/get-property-types";
import { useGetPropertyAttributes } from "@/lib/actions/configuration/property-types/property-attributes/get-property-attributes";
import { useGetPropertyUnits } from "@/lib/actions/configuration/property-units/get-property-units";
import { useMedia } from "@/lib/actions/media/use-media";
import { useGetProductById } from "@/lib/actions/properties/get-by-id";
import { useUpdateProducts } from "@/lib/actions/properties/patch-by-id";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdatePropertySchema = z.object({
  product_uid: z.string().min(1, {
    message: "Property title must be at least 1 character.",
  }),
  status: z.string(),
  area: z.string(),
  size: z.number(),
  unit: z.string(),
  product_type: z.string(),
  adress: z.string().min(1, {
    message: "Address must be at least 1 character.",
  }),
  plot: z.any().optional(),
  block: z.any().optional(),
  road: z.any().optional(),
  remarks: z.any().optional(),
  price_private: z.number(),
  price_public: z.number(),
  media_id: z.any().optional(),
  media_commision: z.any().optional(),
  description: z.any().optional(),
  sector: z.any().optional(),
  attributes: z.any(),
});

type PropertyFormValues = z.infer<typeof UpdatePropertySchema>;

export function UpdateProperty({
  children,
  propertyId,
}: Readonly<{
  children?: React.ReactNode;
  propertyId: number;
}>) {
  const [open, setOpen] = useState(false);
  const [search, _setSearch] = useState("");
  const { data: property, isLoading } = useGetProductById(
    open ? propertyId : undefined
  );
  const { data: areaData, isLoading: areaLoading } = useGetAreas();
  const { data: unitData, isLoading: unitLoading } = useGetPropertyUnits();
  const { data: attributeData, isLoading: attributeLoading } =
    useGetPropertyAttributes(property?.data?.product_type);
  const { data: mediaData, isLoading: mediaLoading } = useMedia(search);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(UpdatePropertySchema),
    defaultValues: {
      product_uid: "",
      block: "",
      road: "",
      plot: "",
      remarks: "",
      adress: "",
      media_commision: "",
      attributes: {},
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (property?.data && form.formState.isDirty === false) {
      form.reset({
        product_uid: property.data.product_uid,
        status: property.data.status,
        area: property.data.area?.toString(),
        sector: property?.data?.sector,
        product_type: property.data.product_type?.toString(),
        size: property.data.size,
        unit: property.data.unit?.toString(),
        block: property.data.block,
        road: property.data.road,
        plot: property.data.plot,
        remarks: property.data.remarks,
        adress: property.data.adress,
        price_private: property.data.price_private,
        price_public: property.data.price_public,
        media_id: property.data.media_id,
        media_commision: property.data.media_commision,
        description: property.data.description,
        attributes: property?.data?.attributes.reduce(
          (acc: any, current: any) => {
            acc[`${current.attribute__slug}`] = current.value;
            return acc;
          },
          {}
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  const { mutateAsync: update, isPending } = useUpdateProducts();

  async function onSubmit(data: PropertyFormValues) {
    form.clearErrors();
    const res = await handleResponse(() =>
      update({
        id: propertyId,
        data: {
          ...data,
          attributes: Array.from(Object.keys(data.attributes), (v) => ({
            name: v,
            value: data?.attributes?.[v],
          })),
        },
      })
    );
    if (res.status) {
      toast("Updated!", {
        description: `Property details has been updated successfully.`,
        closeButton: true,
        important: true,
      });
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof PropertyFormValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error updating Property details. Please try again.`,
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
  return (
    <>
      <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
        <SheetTrigger asChild>
          {children || <Button>Update</Button>}
        </SheetTrigger>
        <SheetContent className="max-h-screen overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Update Property</SheetTitle>
            <SheetDescription>
              Please fill in the form to update the property data.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="space-y-4 mt-5">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-10 w-24 float-right" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" mt-6 px-1"
              >
                <div className="space-y-3 my-5">
                  <FormField
                    control={form.control}
                    name="product_uid"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Bashundhara.." {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row items-start gap-3">
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Size*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter property size"
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Unit Type*</FormLabel>
                          <FormControl>
                            <Select
                              name={field.name}
                              onValueChange={(v) => v && field.onChange(v)}
                              value={field.value?.toString()}
                              disabled={unitLoading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a unit type" />
                              </SelectTrigger>
                              <SelectContent>
                                {unitData?.data?.map((unit: any) => (
                                  <SelectItem
                                    value={unit?.id.toString()}
                                    key={unit?.id}
                                  >
                                    {unit?.unit_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="price_private"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Purchasing Price*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter an amount in bdt."
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price_public"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Selling Price*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter an amount in bdt."
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Enter a property description here..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please enter a detailed description of the property.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Enter any additional comments or notes here..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3 my-7">
                  <SheetTitle>Additional Information</SheetTitle>
                  <SheetDescription>
                    Fill in the following fields for property type and
                    attributes.
                  </SheetDescription>
                  <Separator className="mb-2 mt-3" />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Property Status*</FormLabel>
                        <FormControl>
                          <Select
                            name={field.name}
                            onValueChange={(v) => v && field.onChange(v)}
                            value={field.value?.toString()}
                            disabled={["sold", "junk"].includes(field.value)}
                            // disabled={true}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">
                                Available
                              </SelectItem>
                              <SelectItem value="booked">Booked</SelectItem>
                              <SelectItem value="sold">Sold</SelectItem>
                              <SelectItem value="junk">Junk</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="product_type"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Property Type*</FormLabel>
                        <FormControl>
                          <Select
                            name={field.name}
                            onValueChange={(v) => {
                              v && field.onChange(v), setPropertyTypeId(v);
                            }}
                            value={field.value?.toString()}
                            disabled={typeLoading}
                            // disabled={true}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeData?.data?.map((type: any) => (
                                <SelectItem
                                  value={type?.id.toString()}
                                  key={type?.id}
                                >
                                  {type?.product_type_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <div>
                    {attributeData?.data?.map((a: any) => (
                      <FormField
                        control={form.control}
                        name={`attributes.${a.slug}`}
                        render={({ field }) => (
                          <FormItem className="flex-1" key={a.id}>
                            <FormLabel>{a?.name}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter ${a?.name}`}
                                {...field}
                                // onChange={(e: any) => setInput(e.target.value)}
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 my-7">
                  <SheetTitle>Address Information</SheetTitle>
                  <SheetDescription>
                    Fill in the following fields for an accurate location.
                  </SheetDescription>
                  <Separator className="mb-2 mt-3" />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Area*</FormLabel>
                        <FormControl>
                          <Select
                            name={field.name}
                            onValueChange={(v) => v && field.onChange(v)}
                            value={field.value?.toString()}
                            disabled={areaLoading}
                            // disabled={true}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an area" />
                            </SelectTrigger>
                            <SelectContent>
                              {areaData?.data?.map((area: any) => (
                                <SelectItem
                                  value={area?.id?.toString()}
                                  key={area?.id}
                                >
                                  {area?.area_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adress"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Full address*</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="1234 Main St, City, Country"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is property address. It must be a valid address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row items-start gap-3">
                    <FormField
                      control={form.control}
                      name="block"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Block</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter block number"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Sector</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter sector number"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-row items-start gap-3">
                    <FormField
                      control={form.control}
                      name="road"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Road</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter road number" {...field} />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="plot"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Plot</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter plot number" {...field} />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-3 my-7">
                  <SheetTitle>Media Information</SheetTitle>
                  <SheetDescription>
                    Please select the media of this property from the selection
                    field below.
                  </SheetDescription>
                  <FormField
                    control={form.control}
                    name="media_id"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Media</FormLabel>
                        <FormControl>
                          <Select
                            name={field.name}
                            onValueChange={(v) => v && field.onChange(v)}
                            value={field.value?.toString()}
                            disabled={mediaLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a media" />
                            </SelectTrigger>
                            <SelectContent>
                              {mediaData?.data?.map((media: any) => (
                                <SelectItem
                                  value={media?.id.toString()}
                                  key={media?.id}
                                >
                                  {`${media?.first_name} ${media?.last_name}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="media_commision"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Media Commision</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter an amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Make sure the amount is in bdt.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant={"ghost"}>Cancel</Button>
                  </SheetClose>
                  <Button type="submit" disabled={isPending}>
                    Save
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
