import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const getCustomerLogById = async (id: number | string | undefined) => {
  return instance.get(`/crm-customer-comment/${id}`);
};

export const useGetCustomerLogById = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ["get-customer-log-by-id", id],
    enabled: !!id,
    queryFn: () => getCustomerLogById(id),
  });
};
