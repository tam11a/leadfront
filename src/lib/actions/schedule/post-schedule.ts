import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const create = (data: any) => {
  return instance.post(`/crm-property-visits`, { ...data });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-customers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-customer-by-id"],
      });
    },
  });
};
