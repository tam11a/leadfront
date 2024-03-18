import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const update = ({ id, data }: { id: number | string; data: any }) => {
  return instance.patch(`/crm-employees/${id}`, { ...data });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-employees"],
      });
    },
  });
};
