import instance from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deletePropertyAttributes = (id: number) => {
  return instance.delete(`/crm-product-attribute/${id}`);
};

export const useDeletPropertyAttributes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePropertyAttributes,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-property-attribute"],
      });
    },
  });
};
