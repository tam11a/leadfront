import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";
import {
  DialogDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateCustomerMessageSchema = z.object({
  note: z.string().optional(),
  followup: z.any().optional(),
  status: z.any().optional(),
});

type CreateCustomerMessageFormValues = z.infer<
  typeof CreateCustomerMessageSchema
>;

export function CreateLog({ id }: Readonly<{ id: number }>) {
  const [open, setOpen] = useState(false);

  const { data: customer, isLoading } = useGetCustomerById(id);
  const { user } = useUser();
  const form = useForm<CreateCustomerMessageFormValues>({
    resolver: zodResolver(CreateCustomerMessageSchema),
    defaultValues: {
      note: "",
      followup: undefined,
      status: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isLoading || !customer) return;
    form.reset({
      note: "",
      status: customer.data.status,
      followup: customer.data.followup,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  console.log(form.formState.dirtyFields);

  const onSubmit = async (values: CreateCustomerMessageFormValues) => {
    console.log(values);
  };

  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Log</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-[525px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Log</DialogTitle>
          <DialogDescription>Create a custtomer log.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={() => {
              if (isLoading || !customer) return;
              form.reset({
                note: "",
                status: customer.data.status,
                followup: customer.data.followup,
              });
            }}
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(v) => v && field.onChange(v)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Raw">Raw</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="High Prospect">
                        High Prospect
                      </SelectItem>
                      <SelectItem value="Priority">Priority</SelectItem>
                      <SelectItem value="Booked">Booked</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Junk">Junk</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="followup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow Up</FormLabel>
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
                        <CalendarDatePicker
                          date={selectedDateRange}
                          onDateSelect={(e: any) => (
                            console.log(e), setSelectedDateRange(e)
                          )}
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Aa.." {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row flex-wrap gap-2">
              <Button type="submit">Create Log</Button>
              <Button type="reset" variant={"secondary"}>
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
