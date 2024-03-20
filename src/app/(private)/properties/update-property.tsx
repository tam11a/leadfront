"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetProductById } from "@/lib/actions/properties/get-by-id";
import { useUpdateProduct } from "@/lib/actions/properties/patch-by-id";
import handleResponse from "@/lib/handle-response";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdatePropertySchema = z.object({
  product_uid: z.string().min(1, {
    message: "Property title must be at least 1 character.",
  }),
  area: z.string(),
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
  phone: z.string().min(11, {
    message: "Phone number must be at least 11 characters.",
  }),
  phone2: z.any().optional(),
  dob: z.any().optional(),
  address: z.string().min(1, {
    message: "Address must be at least 1 character.",
  }),
  address2: z.any().optional(),
  zip_code: z.any().optional(),
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
  const { data: property, isLoading } = useGetProductById(
    open ? propertyId : undefined
  );

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(UpdatePropertySchema),
    defaultValues: {
      product_uid: "",
      area: "",
      email: "",
      phone: "",
      phone2: "",
      address: "",
      address2: "",
      zip_code: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (property?.data && form.formState.isDirty === false) {
      form.reset({
        product_uid: property.data.product_uid,
        area: property.data.area,
        email: property.data.email,
        phone: property.data.phone,
        phone2: property.data.phone2,
        dob: property.data.dob,
        address: property.data.address,
        address2: property.data.address2,
        zip_code: property.data.zip_code,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  const { mutateAsync: update, isPending } = useUpdateProduct();

  async function onSubmit(data: PropertyFormValues) {
    form.clearErrors();
    const res = await handleResponse(() =>
      update({
        id: propertyId,
        data,
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
          <SheetHeader>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="example@domain.co" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="017XXXXXXXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the primary/main contact number of the property.
                        Make sure it is a valid number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Number</FormLabel>
                      <FormControl>
                        <Input placeholder="017XXXXXXXX" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the secondary contact number of the
                        property.This is optional. If you enter any number make
                        sure it is a valid number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(e: any) =>
                                field.onChange(format(e as Date, "yyyy-MM-dd"))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1*</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="1234 Main St, City, Country"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your primary address. It must be a valid
                        address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="1234 Main St, City, Country"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your secondary address. It is optional. If you
                        enter any address it must be a valid address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1240" {...field} />
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
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
