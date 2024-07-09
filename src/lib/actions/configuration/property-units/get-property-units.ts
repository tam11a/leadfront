import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const useGetPropertyUnits = () => {
  return useQuery({
    queryKey: ["get-property-units"],
    queryFn: () => {
      return instance.get(`/crm-units`, {});
    },
  });
};
