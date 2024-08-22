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
  note: z
    .string()
    .min(1, { message: "Note must contain at least 1 character(s)" }),
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
  const { access, user } = useUser();
  const { data: customer, isLoading } = useGetCustomerById(id);
  const { mutateAsync: create } = useCreateCustomerComment();

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
      <Form {...form}>
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
    </>
  );
}
