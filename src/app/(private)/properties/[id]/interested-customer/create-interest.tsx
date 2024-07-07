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
import { useGetCustomers } from "@/lib/actions/customers/get-customers";
import { useQueryState } from "nuqs";
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";

const CreateInterestSchema = z.object({
  customer_id: z.string(),
  note: z.any().optional(),
  product_id: z.number(),
  employee_id: z.number(),
});

type InterestFormValues = z.infer<typeof CreateInterestSchema>;

export function CreateInterest({
  id,
  ignoreCustomer = [],
}: Readonly<{ id: number; ignoreCustomer?: number[] }>) {
  const [open, setOpen] = useState(false);
  const [search, _setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  });
  const { data: customerData, isLoading: customerLoading } = useGetCustomers({
    search,
  });
  const user = useUser();
  const { mutateAsync: create, isPending } = useCreateProductsInterest();

  const form = useForm<InterestFormValues>({
    resolver: zodResolver(CreateInterestSchema),
    defaultValues: {
      note: "",
      product_id: id,
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
        <Button onClick={() => setOpen(true)}>Add New</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] sm:max-w-[525px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Select and add a new customer interested in this property
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mt-6 px-1"
          >
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Select
                      name={field.name}
                      onValueChange={(v) => v && field.onChange(v)}
                      value={field.value}
                      disabled={customerLoading}
                      // disabled={true}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerData?.data?.results?.map(
                          (d: any) =>
                            !ignoreCustomer?.includes(d?.id) && (
                              <SelectItem value={d?.id?.toString()} key={d?.id}>
                                {[d?.first_name, d?.last_name].join(" ")}
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
                      placeholder="Input any remarks about this interest"
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
