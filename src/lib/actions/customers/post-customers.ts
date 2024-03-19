import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const create = (data: any) => {
  return instance.post(`/crm-customers`, { ...data });
};

export const useCreateCustomers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-customers"],
      });
    },
  });
};
