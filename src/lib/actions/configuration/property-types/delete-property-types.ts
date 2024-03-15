import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const deletePropertyTypes = (id: number) => {
  return instance.delete(`/crm-product-types/${id}`);
};

export const useDeletPropertyTypes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePropertyTypes,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-property-types"],
      });
    },
  });
};
