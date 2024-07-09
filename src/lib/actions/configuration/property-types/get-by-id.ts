import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const usePropertyTypesById = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ["get-property-units", id],
    enabled: !!id,
    queryFn: () => {
      return instance.get(`/crm-product-types/${id}`);
    },
  });
};
