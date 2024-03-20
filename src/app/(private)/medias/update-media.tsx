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
import { useGetMediaById } from "@/lib/actions/media/get-by-id";
import { useUpdateMedia } from "@/lib/actions/media/patch-by-id";
import handleResponse from "@/lib/handle-response";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateMediaSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name must be at least 1 character.",
  }),
  last_name: z.string().min(1, {
    message: "Last name must be at least 1 character.",
  }),
  gender: z.enum(["Male", "Female", "Non Binary"]),
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

type MediaFormValues = z.infer<typeof UpdateMediaSchema>;

export function UpdateMedia({
  children,
  mediaId,
}: Readonly<{
  children?: React.ReactNode;
  mediaId: number;
}>) {
  const [open, setOpen] = useState(false);
  const { data: media, isLoading } = useGetMediaById(
    open ? mediaId : undefined
  );

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(UpdateMediaSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "Male",
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
    if (media?.data && form.formState.isDirty === false) {
      form.reset({
        first_name: media.data.first_name,
        last_name: media.data.last_name,
        gender: media.data.gender || "",
        email: media.data.email,
        phone: media.data.phone,
        phone2: media.data.phone2,
        dob: media.data.dob,
        address: media.data.address,
        address2: media.data.address2,
        zip_code: media.data.zip_code,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  const { mutateAsync: update, isPending } = useUpdateMedia();

  async function onSubmit(data: MediaFormValues) {
    form.clearErrors();
    const res = await handleResponse(() =>
      update({
        id: mediaId,
        data,
      })
    );
    if (res.status) {
      toast("Updated!", {
        description: `Media details has been updated successfully.`,
        closeButton: true,
        important: true,
      });
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof MediaFormValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error updating Media details. Please try again.`,
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
            <SheetTitle>Update Customer</SheetTitle>
            <SheetDescription>
              Please fill in the form to update the customer data.
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
                <div className="flex flex-row items-start gap-3">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>First Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Last Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender*</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          onValueChange={(v) => v && field.onChange(v)}
                          value={field.value}
                          disabled={field.disabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male (He/Him)</SelectItem>
                            <SelectItem value="Female">
                              Female (She/Her)
                            </SelectItem>
                            <SelectItem value="Non Binary">Others</SelectItem>
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
                        This is the primary/main contact number of the media.
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
                        This is the secondary contact number of the media.This
                        is optional. If you enter any number make sure it is a
                        valid number.
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
