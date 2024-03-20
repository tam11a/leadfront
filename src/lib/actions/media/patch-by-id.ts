import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";
// import { revalidatePath } from "next/cache";

const update = ({ id, data }: { id: number | string; data: any }) => {
  return instance.patch(`/crm-medias/${id}`, { ...data });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-medias"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-media-by-id"],
      });
    },
  });
};
