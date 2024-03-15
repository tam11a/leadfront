import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const update = ({ id, data }: { id: number; data: any }) => {
  return instance.patch(`/crm-product-types/${id}`, { ...data });
};

export const useUpdatePropertyTypes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-property-types"],
      });
    },
  });
};
