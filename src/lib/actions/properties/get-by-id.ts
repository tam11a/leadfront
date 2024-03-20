import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const getProductById = async (id: number | string | undefined) => {
  return instance.get(`/crm-products/${id}`);
};

export const useGetProductById = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ["get-product-by-id", id],
    enabled: !!id,
    queryFn: () => getProductById(id),
  });
};
