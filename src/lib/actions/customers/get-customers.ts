import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ["get-customers"],
    queryFn: () => {
      return instance.get("/crm-customers-table");
    },
  });
};
