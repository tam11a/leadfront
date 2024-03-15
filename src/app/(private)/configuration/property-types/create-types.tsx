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
import { useCreateArea } from "@/lib/actions/configuration/areas/post-area";
import { useCreatePropertyTypes } from "@/lib/actions/configuration/property-types/post-property-types";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreatePropertyTypesSchema = z.object({
  product_type_name: z
    .string()
    .min(1, {
      message: "Property type name must be at least 1 character.",
    })
    .max(30, {
      message: "Property type name must not be longer than 30 characters.",
    }),
});
type CreatePropertyTypesValues = z.infer<typeof CreatePropertyTypesSchema>;

export function CreateSheet() {
  const [open, setOpen] = useState(false);

  const { mutateAsync: create, isPending } = useCreatePropertyTypes();

  const form = useForm<CreatePropertyTypesValues>({
    resolver: zodResolver(CreatePropertyTypesSchema),
    defaultValues: {
      product_type_name: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: CreatePropertyTypesValues) {
    form.clearErrors();
    const res = await handleResponse(() => create(data), [201]);
    if (res.status) {
      toast("Added!", {
        description: `Property type has been created successfully.`,
        important: true,
      });
      form.reset();
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof CreatePropertyTypesValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error creating property type. Please try again.`,
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
          <SheetTitle>Create property type</SheetTitle>
          <SheetDescription>
            Complete the form below to create a new property type.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="product_type_name"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Property Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Flat, Land, etc." {...field} />
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
