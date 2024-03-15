import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const update = ({ id, data }: { id: number; data: any }) => {
  return instance.patch(`/crm-units/${id}`, { ...data });
};

export const useUpdatePropertyUnits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-property-units"],
      });
    },
  });
};
