import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetSoldPropertyList = (params?: { [key: string]: any }) => {
  return useQuery({
    queryKey: ["get-sold-properties", params],
    queryFn: () => {
      return instance.get("/crm-sold-property", {
        params: params,
      });
    },
    retry: 0,
  });
};
