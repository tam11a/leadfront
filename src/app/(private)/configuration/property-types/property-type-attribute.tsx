import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeletPropertyAttributes } from "@/lib/actions/configuration/property-types/property-attributes/delete-property-attributes";
import { useGetPropertyAttributes } from "@/lib/actions/configuration/property-types/property-attributes/get-property-attributes";
import { useCreatePropertyAttribute } from "@/lib/actions/configuration/property-types/property-attributes/post-property-attributes";
import handleResponse from "@/lib/handle-response";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";

const CreatePropertyAttributeSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Property type name must be at least 1 character.",
    })
    .max(30, {
      message: "Property type name must not be longer than 30 characters.",
    }),
  data_type: z.any().optional(),
  slug: z.any().optional(),
});
//type
type CreatePropertyAttributeValues = z.infer<
  typeof CreatePropertyAttributeSchema
>;

export default function TypeAttribute({ id }: { id: number }) {
  const [show, setShow] = useState(false);
  //Get Attribute List
  const { data, isLoading, isError, error } = useGetPropertyAttributes(id);

  //Create Attribute Under Property Types
  const { mutateAsync: create, isPending } = useCreatePropertyAttribute();

  const form = useForm<CreatePropertyAttributeValues>({
    resolver: zodResolver(CreatePropertyAttributeSchema),
    defaultValues: {
      name: "",
      data_type: undefined,
      slug: undefined,
    },
    mode: "onChange",
  });

  async function onSubmit(data: CreatePropertyAttributeValues) {
    form.clearErrors();
    const res = await handleResponse(
      () => create({ ...data, product_type: id }),
      [201]
    );
    if (res.status) {
      toast("Added!", {
        description: `Property attribute has been created successfully.`,
        important: true,
      });
      form.reset();
      setShow(false);
    } else {
      if (typeof res.data === "object") {
        Object.entries(res.data).forEach(([key, value]) => {
          form.setError(key as keyof CreatePropertyAttributeValues, {
            type: "validate",
            message: value as string,
          });
        });
        toast("Error!", {
          description: `There was an error creating property attribute. Please try again.`,
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
    <div className="mt-10">
      <SheetHeader className="text-left">
        <SheetTitle>Custom property fields</SheetTitle>
        <SheetDescription>Add or delete custom fields.</SheetDescription>
      </SheetHeader>
      <Separator className="mb-3 mt-5" />
      {show ? null : (
        <>
          <Button disabled={isPending} onClick={() => setShow(true)}>
            Add Attributes
          </Button>
        </>
      )}

      {show ? (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="border rounded-xl p-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name</FormLabel>
                    <FormControl>
                      <Input placeholder="bedroom, belcony." {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Type</FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                        onValueChange={(v) => v && field.onChange(v)}
                        value={field.value?.toString()}

                        // disabled={true}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                          </SelectGroup>
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="apt_bedroom, apt_belcony."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Don&apos;t use space or special characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className=" flex-row justify-end mt-4">
                <Button
                  variant="destructive"
                  onClick={() => setShow(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  Save changes
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </>
      ) : null}

      <div className="max-w-xl">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </>
        ) : (
          <>
            {data?.data?.map((attribute: any) => (
              <AttributesCard attribute={attribute} key={attribute?.id} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function AttributesCard({ attribute }: { attribute: any }) {
  const { mutateAsync: deleteAsync, isPending } = useDeletPropertyAttributes();

  async function onSubmit() {
    const res = await handleResponse(() => deleteAsync(attribute.id), [204]);
    if (res.status) {
      toast("Deleted!", {
        description: `Property attribute has been deleted successfully.`,
        important: true,
      });
    } else {
      toast("Error!", {
        description: `There was an error deleting property attriutes. Please try again.`,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onSubmit(),
        },
      });
    }
  }

  return (
    <Card
      key={attribute.id}
      className="flex flex-row gap-2 items-center my-2 pb-0"
    >
      <CardHeader className="flex-1">
        <CardTitle className="mb-1">{attribute.name}</CardTitle>
        <CardDescription className="text-xs">
          Slug Name: <span className="text-primary">{attribute.slug}</span>
        </CardDescription>
        <CardDescription className="text-xs">
          Data Type: <span className="text-primary">{attribute.data_type}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row items-center gap-2 p-2">
        <Button
          variant={"outline"}
          size={"icon"}
          className="text-destructive"
          onClick={onSubmit}
          disabled={isPending}
        >
          <MdOutlineDelete />
        </Button>
      </CardFooter>
    </Card>
  );
}
