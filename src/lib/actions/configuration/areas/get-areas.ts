import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const useGetAreas = () => {
  return useQuery({
    queryKey: ["get-areas"],
    queryFn: () => {
      return instance.get(`/crm-areas`, {});
    },
  });
};
