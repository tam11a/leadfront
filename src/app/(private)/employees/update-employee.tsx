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
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetEmployeeById } from "@/lib/actions/employees/get-by-id";
import { useUpdateEmployee } from "@/lib/actions/employees/patch-by-id";
import handleResponse from "@/lib/handle-response";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateEmployeeSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name must be at least 1 character.",
  }),
  last_name: z.string().min(1, {
    message: "Last name must be at least 1 character.",
  }),
  employee_uid: z.string().min(1, {
    message: "Employee UID must be at least 1 character.",
  }),
  gender: z.enum(["Male", "Female", "Non Binary"]),
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
  phone: z
    .string()
    .min(11, {
      message: "Phone number must be at least 11 characters.",
    })
    .max(11, { message: "Phone number cannot exceed 11 characters." }),
  dob: z.any().optional(),
  work_hour: z.any().optional(),
  salary: z.any().optional(),
  bank_name: z.any().optional(),
  bank_branch: z.any().optional(),
  bank_account_number: z.any().optional(),
  bank_routing_number: z.any().optional(),
  address: z.string().min(1, {
    message: "Address must be at least 1 character.",
  }),
  address2: z.any().optional(),
  zip_code: z.any().optional(),
  nid: z.any({
    description: "NID must be a number.",
  }),
  tin: z.any().optional(),
  is_active: z.boolean(),
  user_id: z.any().optional(),
});

type EmployeeFormValues = z.infer<typeof UpdateEmployeeSchema>;

export function UpdateEmployee({
  children,
  employeeId,
}: Readonly<{
  children?: React.ReactNode;
  employeeId: number;
}>) {
  const [open, setOpen] = useState(false);

  const { data: employee, isLoading } = useGetEmployeeById(
    open ? employeeId : undefined
  );

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      employee_uid: "",
      gender: "Male",
      email: "",
      phone: "",
      address: "",
      nid: undefined,
      is_active: true,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (employee && form.formState.isDirty === false) {
      form.reset({
        first_name: employee.data.first_name,
        last_name: employee.data.last_name,
        employee_uid: employee.data.employee_uid,
        gender: employee.data.gender,
        email: employee.data.email,
        phone: employee.data.phone,
        dob: employee.data.dob,
        work_hour: employee.data.work_hour,
        salary: employee.data.salary,
        bank_name: employee.data.bank_name,
        bank_branch: employee.data.bank_branch,
        bank_account_number: employee.data.bank_account_number,
        bank_routing_number: employee.data.bank_routing_number,
        address: employee.data.address,
        address2: employee.data.address2,
        zip_code: employee.data.zip_code,
        nid: employee.data.nid,
        tin: employee.data.tin,
        is_active: employee.data.is_active,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);

  const { mutateAsync: update, isPending } = useUpdateEmployee();

  async function onSubmit(data: EmployeeFormValues) {
    form.clearErrors();
    const res = await handleResponse(() =>
      update({
        id: employeeId,
        data,
      })
    );
    if (res.status) {
      toast("Updated!", {
        description: `Employee details has been updated successfully.`,
        closeButton: true,
        important: true,
      });
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof EmployeeFormValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error updating Employee details. Please try again.`,
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
            <SheetTitle>Update Employee</SheetTitle>
            <SheetDescription>
              Please fill in the form to update the employee data.
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
                  name="employee_uid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee UID*</FormLabel>
                      <FormControl>
                        <Input placeholder="CEO-001" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender*</FormLabel>
                      <Select
                        onValueChange={(v) => v && field.onChange(v)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male (He/Him)</SelectItem>
                          <SelectItem value="Female">
                            Female (She/Her)
                          </SelectItem>
                          <SelectItem value="Non Binary">Others</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <FormLabel>Phone*</FormLabel>
                      <FormControl>
                        <Input placeholder="017XXXXXXXX" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
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
                              selected={new Date(field.value)}
                              // defaultMonth={new Date(field.value)}
                              onSelect={(e: any) =>
                                field.onChange(format(e as Date, "yyyy-MM-dd"))
                              }
                              captionLayout="dropdown-buttons"
                              fromYear={moment().year() - 100}
                              toYear={moment().year()}
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

                <div className="flex flex-row items-start gap-3">
                  <FormField
                    control={form.control}
                    name="work_hour"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Work Hour</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="8" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="20000" {...field} />
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
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="XYZ Bank" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bank_branch"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bank Branch</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dhaka, Chittagong Etc."
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
                    name="bank_account_number"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bank Account Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="12938712*****78"
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
                    name="bank_routing_number"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bank Routing Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="123123"
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

                <div className="flex flex-row items-start gap-3">
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
                  <FormField
                    control={form.control}
                    name="tin"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>TIN</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100120321***8"
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
                  name="nid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NID*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10123*****"
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
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="pt-4">
                      <div className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Switch
                            id="is_active"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label htmlFor="is_active">Active Status</Label>
                      </div>
                      <FormDescription>
                        Active status will determine if the employee is active
                        or not.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem hidden>
                      <FormControl>
                        <Input
                          readOnly
                          type="number"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
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
