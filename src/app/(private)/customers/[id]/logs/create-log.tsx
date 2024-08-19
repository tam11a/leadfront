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

import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";
import { useCreateCustomerComment } from "@/lib/actions/customer-logs/post-customer-comment";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import handleResponse from "@/lib/handle-response";

import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateCustomerMessageSchema = z.object({
  note: z.string().min(1),
  name: z.string(),
  type: z.number(),
  customer_id: z.number().optional(),
  employee_id: z.number().optional(),
  description: z.string().optional(),
});

type CreateCustomerMessageFormValues = z.infer<
  typeof CreateCustomerMessageSchema
>;

export function CreateLog({ id }: Readonly<{ id: number }>) {
  // const [open, setOpen] = useState(false);

  const { access, user } = useUser();
  const { data: customer, isLoading } = useGetCustomerById(id);
  const { mutateAsync: create, isPending } = useCreateCustomerComment();

  const form = useForm<CreateCustomerMessageFormValues>({
    resolver: zodResolver(CreateCustomerMessageSchema),
    defaultValues: {
      note: "",
      type: 5,
      customer_id: customer?.data?.id,
      employee_id: access?.data?.user_id,
      description: "added a note.",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isLoading || !customer) return;
    form.reset({
      name: access?.data?.username,
      note: "",
      type: 5,
      description: "added a note.",
      customer_id: customer?.data?.id,
      employee_id: user?.id,
    });
  }, [customer]);

  const onSubmit = async (data: CreateCustomerMessageFormValues) => {
    console.log(data);
    form.clearErrors();
    const res = await handleResponse(() => create(data), [201]);
    if (res.status) {
      toast("Added!", {
        description: `Note has been Added successfully.`,
        important: true,
      });
      form.reset();
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof CreateCustomerMessageFormValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error adding note. Please try again.`,
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
  };
  return (
    <>
      {/* <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Log</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-[525px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Log</DialogTitle>
          <DialogDescription>Create a custtomer log.</DialogDescription>
        </DialogHeader> */}
      <Form {...form}>
        {/* <FormField
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
                    <SelectItem value="High Prospect">High Prospect</SelectItem>
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
          /> */}
        {/* <FormField
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
                      <Calendar
                        mode="single"
                        fromDate={new Date()}
                        selected={new Date(field.value)}
                        onSelect={(e: any) =>
                          field.onChange(format(e as Date, "yyyy-MM-dd"))
                        }
                        initialFocus={false}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={() => {
            if (isLoading || !customer) return;
            form.reset({
              note: "",
            });
          }}
        >
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
          <div className="flex flex-row flex-wrap gap-2 mt-2">
            <Button type="submit">Create Log</Button>
            <Button type="reset" variant={"secondary"}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
      {/* </DialogContent>
    </Dialog> */}
    </>
  );
}
