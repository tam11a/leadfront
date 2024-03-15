import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const useGetPropertyTypes = (search: string) => {
  return useQuery({
    queryKey: ["get-property-types", search],
    queryFn: () => {
      return instance.get(`/crm-product-types`, {
        params: {
          search,
        },
      });
    },
  });
};
