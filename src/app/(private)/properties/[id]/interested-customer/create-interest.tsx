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

export function CreateInterest() {
  const [open, setOpen] = useState(false);

  const { mutateAsync: create, isPending } = useCreateProductsInterest();

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add New</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Select and add a new customer interested in this property
          </DialogDescription>
        </DialogHeader>
        {/* <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mt-6 px-1"
          ></form>
        </Form> */}
        <DialogFooter>
          <Button type="submit" size={"sm"}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
