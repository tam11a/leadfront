import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetschedules = (params?: { [key: string]: any }) => {
  return useQuery({
    queryKey: ["get-schedules", params],
    queryFn: () => {
      return instance.get("/crm-property-visits", {
        params,
      });
    },
  });
};
