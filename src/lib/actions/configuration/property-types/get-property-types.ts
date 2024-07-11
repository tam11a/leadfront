import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const useGetPropertyTypes = () => {
  return useQuery({
    queryKey: ["get-property-types"],
    queryFn: () => {
      return instance.get(`/crm-product-types`, {});
    },
  });
};
