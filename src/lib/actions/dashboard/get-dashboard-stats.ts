import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetStats = (params?: { [key: string]: any }) => {
  return useQuery({
    queryKey: ["get-dashboard-stats", params],
    queryFn: () => {
      return instance.get("/crm-dashboard-admin", {
        params,
      });
    },
  });
};
