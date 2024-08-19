import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetCustomerLogs = (params?: { [key: string]: any }) => {
  return useQuery({
    queryKey: ["get-customer-logs", params],
    queryFn: () => {
      return instance.get("/crm-customer-comment", {
        params,
      });
    },
  });
};
