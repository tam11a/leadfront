import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const create = (data: any) => {
  return instance.post(`/crm-sold-property`, { ...data });
};

export const useCreateSoldProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-customer-by-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-interests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-interests-v1"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-product-by-id"],
      });
    },
  });
};
