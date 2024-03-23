import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const create = (data: any) => {
  return instance.post(`/crm-products`, { ...data });
};

export const useCreateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-products"],
      });
    },
  });
};
