import instance from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const create = (data: any) => {
  return instance.post(`/crm-product-attribute`, { ...data });
};

export const useCreatePropertyAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-property-attribute"],
      });
    },
  });
};
