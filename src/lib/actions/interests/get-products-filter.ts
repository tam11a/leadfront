import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetProductsFilter = (params?: any) => {
  return useQuery({
    queryKey: ["get-products-filter", params],
    queryFn: () => {
      return instance.get("/crm-products-filter", {
        params,
      });
    },
  });
};
