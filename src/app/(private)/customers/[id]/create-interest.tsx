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
import { useState } from "react";
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
import { useQueryState } from "nuqs";
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";
import { useGetProductsFilter } from "@/lib/actions/interests/get-products-filter";
import { useGetAreas } from "@/lib/actions/configuration/areas/get-areas";
import { useGetPropertyTypes } from "@/lib/actions/configuration/property-types/get-property-types";

const CreateInterestSchema = z.object({
  customer_id: z.number(),
  note: z.any().optional(),
  product_id: z.string(),
  employee_id: z.number(),
});

type InterestFormValues = z.infer<typeof CreateInterestSchema>;

export function CreateInterest({
  id,
  ignoreProperties = [],
}: Readonly<{ id: number; ignoreProperties?: number[] }>) {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const [search, _setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  });

  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const { data: areaData, isLoading: isAreaDataLoading } = useGetAreas();
  const { data: propertyTypeData, isLoading: isPropertyTypeDataLoading } =
    useGetPropertyTypes();
  console.log(propertyTypeData);
  const { data: propertyfilteredData, isLoading: propertyFilteredLoading } =
    useGetProductsFilter({
      area: area,
      product_type: propertyType,
    });
  const { mutateAsync: create, isPending } = useCreateProductsInterest();

  //submit form
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
    const res = await handleResponse(() => create({ ...data }), [201]);
    if (res.status) {
      toast("Added!", {
        description: `Interested customer has been created successfully.`,
        important: true,
      });
      form.reset();
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

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add Interest</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-[525px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Property</DialogTitle>
          <DialogDescription>
            Select and add a new property that this customer is interested in.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3  px-1"
          >
            <div className="flex flex-row items-start gap-3">
              <FormItem className="flex-1">
                <FormLabel>Area</FormLabel>
                <FormControl>
                  <Select
                    value={area}
                    onValueChange={(v) => setArea(v)}
                    disabled={isAreaDataLoading}

                    // disabled={true}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaData?.data?.map((d: any) => (
                        <SelectItem value={d?.id?.toString()} key={d?.id}>
                          {d?.area_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel>Property type</FormLabel>
                <FormControl>
                  <Select
                    value={propertyType}
                    onValueChange={(v) => setPropertyType(v)}
                    disabled={isPropertyTypeDataLoading}

                    // disabled={true}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a proprty" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypeData?.data?.map((d: any) => (
                        <SelectItem value={d?.id?.toString()} key={d?.id}>
                          {d?.product_type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            </div>
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Property Name*</FormLabel>
                  <FormControl>
                    <Select
                      name={field.name}
                      onValueChange={(v) => v && field.onChange(v)}
                      value={field.value?.toString()}
                      disabled={propertyFilteredLoading}
                      // disabled={true}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a proprty" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyfilteredData?.data?.map(
                          (d: any) =>
                            !ignoreProperties?.includes(d?.id) && (
                              <SelectItem value={d?.id?.toString()} key={d?.id}>
                                {d?.product_uid}
                              </SelectItem>
                            )
                        )}
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
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
