import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteEmployee = (id: number) => {
  return instance.delete(`/crm-employees/${id}`);
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-employees"],
      });
    },
  });
};
