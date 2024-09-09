import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteSchedule = (id: number) => {
  return instance.delete(`/crm-property-visits/${id}`);
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-schedules"],
      });
    },
  });
};
