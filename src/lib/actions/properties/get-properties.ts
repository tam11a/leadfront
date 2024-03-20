import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetProperties = (params?: any) => {
  return useQuery({
    queryKey: ["get-properties", params],
    queryFn: () => {
      return instance.get("/crm-products-table", {
        params,
      });
    },
  });
};
