"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useUser from "@/hooks/useUser";
import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateLog } from "./create-log";

const CreateCustomerMessageSchema = z.object({
  note: z.string().optional(),
  followup: z.any().optional(),
  status: z.any().optional(),
});

type CreateCustomerMessageFormValues = z.infer<
  typeof CreateCustomerMessageSchema
>;

export default function CustomerLogsPage({ id }: { id: number }) {
  return (
    <div className="space-y-3 px-8 py-6 border-l h-full md:min-h-[400px] md:min-w-[400px]">
      <CreateLog id={id} />
    </div>
  );
}
