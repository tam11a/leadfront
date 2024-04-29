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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useGetAreas } from "@/lib/actions/configuration/areas/get-areas";
import { useGetPropertyTypes } from "@/lib/actions/configuration/property-types/get-property-types";
import { useGetPropertyUnits } from "@/lib/actions/configuration/property-units/get-property-units";
import { useMedia } from "@/lib/actions/media/use-media";
import { useCreateProducts } from "@/lib/actions/properties/post-prodcts";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreatePropertySchema = z.object({
  product_uid: z.string().min(1, {
    message: "Property title must be at least 1 character.",
  }),
  area: z.string(),
  product_type: z.string(),
  size: z.number(),
  unit: z.string(),
  plot: z.any().optional(),
  facing: z.string(),
  block: z.any().optional(),
  road: z.any().optional(),
  bedrooms: z.any().optional(),
  bathrooms: z.any().optional(),
  balcony: z.any().optional(),
  floor: z.any().optional(),
  remarks: z.any().optional(),
  adress: z.string().min(1, {
    message: "Address must be at least 1 character.",
  }),
  price_private: z.number(),
  price_public: z.number(),
  media_id: z.any().optional(),
  media_commision: z.any().optional(),
  land_type: z.any().optional(),
  apartment_type: z.any().optional(),
});

type PropertyFormValues = z.infer<typeof CreatePropertySchema>;

export function CreateProperty() {
  const [open, setOpen] = useState(false);
  const [search, _setSearch] = useState("");

  const { mutateAsync: create, isPending } = useCreateProducts();

  const { data: areaData, isLoading: areaLoading } = useGetAreas(search);
  const { data: unitData, isLoading: unitLoading } =
    useGetPropertyUnits(search);
  const { data: typeData, isLoading: typeLoading } =
    useGetPropertyTypes(search);
  const { data: mediaData, isLoading: mediaLoading } = useMedia(search);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(CreatePropertySchema),
    defaultValues: {
      product_uid: "",
      block: "",
      road: "",
      plot: "",
      remarks: "",
      adress: "",
      media_commision: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: PropertyFormValues) {
    form.clearErrors();
    const res = await handleResponse(() => create(data), [201]);
    if (res.status) {
      toast("Added!", {
        description: `Property has been created successfully.`,
        important: true,
      });
      form.reset();
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
          description: `There was an error creating property. Please try again.`,
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
        <Button onClick={() => setOpen(true)}>Add New</Button>
        <SheetContent className="max-h-screen overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Property</SheetTitle>
            <SheetDescription>
              Complete the form below to create a new property.
            </SheetDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 mt-6 px-1"
              >
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
                  name="product_type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Property Type*</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          onValueChange={(v) => v && field.onChange(v)}
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
                />
                <FormField
                  control={form.control}
                  name="land_type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Land Type</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          onValueChange={(v) => v && field.onChange(v)}
                          value={field.value}
                          disabled={field.disabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a land type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"Agricultural"}>
                              Agricultural
                            </SelectItem>
                            <SelectItem value={"Residential"}>
                              Residential
                            </SelectItem>
                            <SelectItem value={"Commercial"}>
                              Commercial
                            </SelectItem>
                            <SelectItem value={"Others"}>Others</SelectItem>
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
                  name="apartment_type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Apartment Type</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          onValueChange={(v) => v && field.onChange(v)}
                          value={field.value}
                          disabled={field.disabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a apartment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"Studio"}>Studio</SelectItem>
                            <SelectItem value={"Duplex"}>Duplex</SelectItem>
                            <SelectItem value={"Triplex"}>Triplex</SelectItem>
                            <SelectItem value={"Garden"}>Garden</SelectItem>
                            <SelectItem value={"High-rise"}>
                              High-rise
                            </SelectItem>
                            <SelectItem value={"Others"}>Others</SelectItem>
                          </SelectContent>
                        </Select>
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
                            placeholder="Enter size of the property"
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
                <div className="flex flex-row items-start gap-3">
                  <FormField
                    control={form.control}
                    name="block"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Block/Sector</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter block number" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>
                <div className="flex flex-row items-start gap-3">
                  <FormField
                    control={form.control}
                    name="plot"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Plot</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter size of the property"
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
                    name="facing"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Facing</FormLabel>
                        <FormControl>
                          <Select
                            name={field.name}
                            onValueChange={(v) => v && field.onChange(v)}
                            value={field.value}
                            disabled={field.disabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a facing" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"East"}>East</SelectItem>
                              <SelectItem value={"West"}>West</SelectItem>
                              <SelectItem value={"North"}>North</SelectItem>
                              <SelectItem value={"South"}>South</SelectItem>
                              <SelectItem value={"Southeast"}>
                                Southeast
                              </SelectItem>
                              <SelectItem value={"Southwest"}>
                                Southwest
                              </SelectItem>
                              <SelectItem value={"Northeast"}>
                                Northeast
                              </SelectItem>
                              <SelectItem value={"Northwest"}>
                                Northwest
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                    name="floor"
                    disabled={true}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Floor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter floor number" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="balcony"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Balcony</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter number of balcony"
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
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter number of bedrooms"
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
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter number of bathrooms"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="1234 Main St, City, Country"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is property&apos;s address. It must be a valid
                        address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_private"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Purchasing Price*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the price in bdt."
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
                          placeholder="Enter the price in bdt."
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
                  name="media_id"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Media</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          onValueChange={(v) => v && field.onChange(v)}
                          value={field.value?.toString()}
                          disabled={unitLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a the name of the media" />
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
                        <Input
                          placeholder="Enter the price in bdt."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
