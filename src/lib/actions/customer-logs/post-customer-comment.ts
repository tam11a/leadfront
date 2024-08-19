import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const create = (data: any) => {
  return instance.post(`/crm-customer-comment`, { ...data });
};

export const useCreateCustomerComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-customer-logs"],
      });
    },
  });
};
