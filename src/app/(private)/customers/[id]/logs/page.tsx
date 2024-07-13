"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateLog } from "./create-log";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";

const CreateCustomerMessageSchema = z.object({
  note: z.string().optional(),
  followup: z.any().optional(),
  status: z.any().optional(),
  datePicker: z.any(),
});

type CreateCustomerMessageFormValues = z.infer<
  typeof CreateCustomerMessageSchema
>;

export default function CustomerLogsPage({ id }: { id: number }) {
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
  return (
    <div className="space-y-3 px-8 py-6 border-l h-full min-h-[400px] md:min-w-[300px]">
      <CreateLog id={id} />
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
            name="datePicker"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-normal">
                  Single Date
                </FormLabel>
                <FormControl className="w-full">
                  <CalendarDatePicker
                    date={field.value}
                    onDateSelect={({ from, to }) => {
                      form.setValue("datePicker", { from, to });
                    }}
                    variant="outline"
                    numberOfMonths={1}
                    className="min-w-[250px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
