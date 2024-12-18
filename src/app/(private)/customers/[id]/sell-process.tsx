"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import useUser from "@/hooks/useUser";
import { useUpdateCustomer } from "@/lib/actions/customers/patch-by-id";
import { useGetProductById } from "@/lib/actions/properties/get-by-id";
import { useCreateSoldProperty } from "@/lib/actions/sell-process/post-sell-process";
import handleResponse from "@/lib/handle-response";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SellProcessProps {
  TriggerComponent: React.FC<{ disabled?: boolean }>;
  interestId: number;
  customerId: number;
  propertyId: number;
  disabled: boolean;
}

const MarkAsSoldSchema = z.object({
  selling_price: z.string(),
  sold_date: z.any(),
  property: z.number().positive(),
  customer: z.number().positive(),
  customer_representative: z.number().positive(),
});
type MarkAsSoldFormValues = z.infer<typeof MarkAsSoldSchema>;

export default function SellProcess({
  TriggerComponent,
  customerId,
  interestId,
  propertyId,
  disabled = false,
}: SellProcessProps) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { data: propertyData } = useGetProductById(propertyId);
  const { mutateAsync: create, isPending } = useCreateSoldProperty();
  const { mutateAsync: update, isPending: isCustomerUpdatePending } =
    useUpdateCustomer();

  const form = useForm<MarkAsSoldFormValues>({
    resolver: zodResolver(MarkAsSoldSchema),
    defaultValues: {
      property: interestId,
      customer: customerId,
      //   sold_date: new Date(),
      selling_price: "0",
      customer_representative: user?.id,
    },
  });

  async function onSubmit(data: MarkAsSoldFormValues) {
    // Call the API to  form.clearErrors();
    const res = await handleResponse(() => create(data), [201]);
    if (res.status) {
      toast("Added!", {
        description: `Property is sold successfully.`,
        important: true,
      });
      form.reset();
      try {
        await handleResponse(
          () => update({ id: customerId, data: { status: "sold" } }),
          [200]
        );
      } catch (error) {}
      setOpen(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof MarkAsSoldFormValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error while maarking the propery sold. Please try again.`,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled}>
        <TriggerComponent disabled={disabled} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as sold</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this property as sold to customer #
            {customerId}?
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div>
          <span className="flex gap-1 items-center mb-1 max-w-lg">
            <p className="font-semibold text-sm">Property :</p>
            <p className="text-sm">{propertyData?.data?.product_uid}</p>
          </span>
          <span className="flex gap-1 items-center mb-1 max-w-lg">
            <p className="font-semibold text-sm">Public Price :</p>
            <p className="text-sm">{propertyData?.data?.price_public}</p>
          </span>
          <span className="flex gap-1 items-center mb-1 max-w-lg">
            <p className="font-semibold text-sm">Private Price :</p>
            <p className="text-sm">{propertyData?.data?.price_private}</p>
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-row items-start gap-3">
              <FormField
                control={form.control}
                name="selling_price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount in bdt"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the selling price in bdt
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sold_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sold Date</FormLabel>
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
                            captionLayout="dropdown-buttons"
                            selected={new Date(field.value)}
                            onDayClick={(e: any) => {
                              field.onChange(format(e as Date, "yyyy-MM-dd"));
                            }}
                            fromYear={moment().year() - 50}
                            toYear={moment().year() + 50}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Select the date the property was sold
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
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
