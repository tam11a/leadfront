import instance from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

export const useGetPropertyAttributes = (product_type: number) => {
  return useQuery({
    queryKey: ["get-property-attribute", product_type],
    queryFn: () => {
      return instance.get(`/crm-product-attribute`, {
        params: {
          product_type,
        },
      });
    },
  });
};
