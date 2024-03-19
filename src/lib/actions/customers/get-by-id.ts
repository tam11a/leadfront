import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useCustomerById = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ["get-customer-by-id", id],
    enabled: !!id,
    queryFn: () => {
      return instance.get(`/crm-customers/${id}`);
    },
  });
};
