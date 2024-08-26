"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetInterests } from "@/lib/actions/interests/get-interests";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { FiActivity } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { Loading } from "../../token-validation-checker";
import { CreateInterest } from "./create-interest";
import { useDeleteInterest } from "@/lib/actions/interests/delete-interests";
import handleResponse from "@/lib/handle-response";
import { toast } from "sonner";

export default function CustomerInterestsPage({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetInterests({
    id: params.id,
    varr: true,
  });

  const { mutateAsync: Delete, isPending: isDeleting } = useDeleteInterest();

  if (isLoading) return <Loading />;

  async function onDelete(Iid: number) {
    const res = await handleResponse(() => Delete(Iid), 204);
    if (res.status) {
      toast("Deleted!", {
        description: `Interest has been deleted successfully.`,
        closeButton: true,
        important: true,
      });
    } else {
      toast("Error!", {
        description: res.message,
        important: true,
        action: {
          label: "Retry",
          onClick: () => onDelete(Iid),
        },
      });
    }
  }

  return !data?.data?.length ? (
    <div className="flex flex-col items-center justify-center min-w-[300px] w-full min-h-[400px] gap-5">
      <FiActivity className="text-5xl mx-auto text-gray-400" />
      <CardDescription>No interest added yet.</CardDescription>
      <CreateInterest
        id={+params.id}
        ignoreProperties={data?.data?.map((d: any) => d.id)}
      />
    </div>
  ) : (
    <div className="space-y-3 max-w-lg">
      <div className="flex flex-row items-center gap-3">
        <Input
          placeholder="Search property name, area.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <CreateInterest
          id={+params.id}
          ignoreProperties={data?.data?.map((d: any) => d.id)}
        />
      </div>
      {data?.data?.map((interest: any) => (
        <Card
          key={interest.id}
          className={cn(
            "flex flex-row justify-between",
            search &&
              !(
                interest.name.toLowerCase().includes(search.toLowerCase()) ||
                interest.area.toLowerCase().includes(search.toLowerCase())
              )
              ? "hidden"
              : ""
          )}
        >
          <CardHeader>
            <CardTitle>
              <Link
                href={`/properties/${interest.id}`}
                className="text-primary hover:underline"
              >
                {interest.name}
              </Link>
            </CardTitle>
            <CardContent className="flex p-0 flex-row items-center flex-wrap">
              <CardDescription>{interest.area}</CardDescription>
              <Badge className="ml-2" variant={"outline"}>
                {interest.type}
              </Badge>
            </CardContent>
          </CardHeader>
          <CardHeader>
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => onDelete(interest?.interest)}
              className="text-destructive"
            >
              <MdOutlineDelete />
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
