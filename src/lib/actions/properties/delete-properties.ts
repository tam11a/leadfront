import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteProperty = (id: number) => {
  return instance.delete(`/crm-products/${id}`);
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-products"],
      });
    },
  });
};
