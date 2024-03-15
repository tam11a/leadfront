import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const deletePropertyUnits = (id: number) => {
  return instance.delete(`/crm-units/${id}`);
};

export const useDeletPropertyUnits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePropertyUnits,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-property-units"],
      });
    },
  });
};
