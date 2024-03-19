import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetCustomers = (params?: any) => {
  return useQuery({
    queryKey: ["get-customers", params],
    queryFn: () => {
      return instance.get("/crm-customers-table", {
        params,
      });
    },
  });
};
