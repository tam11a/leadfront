import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetProducts = (params?: any) => {
  return useQuery({
    queryKey: ["get-products", params],
    queryFn: () => {
      return instance.get("/crm-products-table", {
        params,
      });
    },
  });
};
