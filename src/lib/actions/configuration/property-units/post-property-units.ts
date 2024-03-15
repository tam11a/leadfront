import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const create = (data: any) => {
  return instance.post(`/crm-units`, { ...data });
};

export const useCreatePropertyUnits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-property-units"],
      });
    },
  });
};
