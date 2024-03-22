import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useMedia = (params?: any) => {
  return useQuery({
    queryKey: ["get-medias", params],
    queryFn: () => {
      return instance.get("/crm-medias", {
        params,
      });
    },
  });
};
