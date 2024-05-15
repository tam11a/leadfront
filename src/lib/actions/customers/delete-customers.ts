import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteCustomer = (id: number) => {
  return instance.delete(`/crm-customers/${id}`);
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-customers"],
      });
    },
  });
};
