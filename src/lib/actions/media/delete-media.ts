import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteMedia = (id: number) => {
  return instance.delete(`/crm-medias/${id}`);
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-medias"],
      });
    },
  });
};
