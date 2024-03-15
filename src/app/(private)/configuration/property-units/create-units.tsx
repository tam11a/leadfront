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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreatePropertyUnits } from "@/lib/actions/configuration/property-units/post-property-units";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateUnitSchema = z.object({
  unit_name: z
    .string()
    .min(1, {
      message: "Measurement unit name must be at least 1 character.",
    })
    .max(30, {
      message: "Measurement unit name must not be longer than 30 characters.",
    }),
});
type CreateUnitValues = z.infer<typeof CreateUnitSchema>;

export function CreateSheet() {
  const [open, setOpen] = useState(false);

  const { mutateAsync: create, isPending } = useCreatePropertyUnits();

  const form = useForm<CreateUnitValues>({
    resolver: zodResolver(CreateUnitSchema),
    defaultValues: {
      unit_name: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: CreateUnitValues) {
    form.clearErrors();
    const res = await handleResponse(() => create(data), [201]);
    if (res.status) {
      toast("Added!", {
        description: `Measurement unit has been created successfully.`,
        important: true,
      });
      form.reset();
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof CreateUnitValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error creating measurement unit. Please try again.`,
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
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <Button onClick={() => setOpen(true)}>Add New</Button>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Measurement unit</SheetTitle>
          <SheetDescription>
            Complete the form below to create a new measurement unit.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="unit_name"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Measurement unit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Katha, Bigha, etc." {...field} />
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
      </SheetContent>
    </Sheet>
  );
}
