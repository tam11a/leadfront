import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useEmployees = (params?: any) => {
  return useQuery({
    queryKey: ["get-employees", params],
    queryFn: () => {
      return instance.get("/crm-employees", {
        params,
      });
    },
  });
};
