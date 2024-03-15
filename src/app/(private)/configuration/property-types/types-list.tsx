"use client";

//ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

//api components
import { useGetPropertyTypes } from "@/lib/actions/configuration/property-types/get-property-types";
import { useDeletPropertyTypes } from "@/lib/actions/configuration/property-types/delete-property-types";

//crud components
import { CreateSheet } from "./create-types";
import { UpdateSheet } from "./update-types";

//functional components
import { useState } from "react";
import handleResponse from "@/lib/handle-response";
import moment from "moment";

// Icons
import { MdOutlineDelete } from "react-icons/md";

export default function PropertyTypesList() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetPropertyTypes(search);
  if (isError) throw new Error(error.message);

  return (
    <>
      <div className="flex flex-row items-center max-w-md gap-3">
        <Input
          placeholder="Filter property types..."
          className="flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CreateSheet />
      </div>
      <div className="max-w-xl space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </>
        ) : (
          <>
            {data?.data?.map((type: any) => (
              <TypesCard type={type} key={type?.id} />
            ))}
          </>
        )}
      </div>
    </>
  );
}

function TypesCard({ type }: { type: any }) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: deleteAsync, isPending } = useDeletPropertyTypes();

  async function onSubmit() {
    const res = await handleResponse(() => deleteAsync(type.id), [204]);
    if (res.status) {
      toast("Deleted!", {
        description: `Property type has been deleted successfully.`,
        important: true,
      });
    } else {
      toast("Error!", {
        description: `There was an error deleting property type. Please try again.`,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onSubmit(),
        },
      });
    }
  }

  return (
    <Card key={type.id} className="flex flex-row gap-3 items-center ">
      <CardHeader className="flex-1">
        <CardTitle>{type.product_type_name}</CardTitle>
        <CardDescription className="text-xs">
          Last Updated{" "}
          <span className="text-primary mr-1">
            {moment(type.updated_at).format("ll")}
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row items-center gap-1 p-6">
        {!isPending && (
          <UpdateSheet open={open} setOpen={setOpen} old_data={type} />
        )}
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
