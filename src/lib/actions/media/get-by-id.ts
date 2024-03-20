import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const getMediaById = async (id: number | string | undefined) => {
  return instance.get(`/crm-medias/${id}`);
};

export const useGetMediaById = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ["get-media-by-id", id],
    enabled: !!id,
    queryFn: () => getMediaById(id),
  });
};
