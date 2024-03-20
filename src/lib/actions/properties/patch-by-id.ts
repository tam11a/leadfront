import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";
// import { revalidatePath } from "next/cache";

const update = ({ id, data }: { id: number | string; data: any }) => {
  return instance.patch(`/crm-products/${id}`, { ...data });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-product-by-id"],
      });
    },
  });
};
