import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const getCustomerById = async (id: number | string | undefined) => {
	return instance.get(`/crm-customers/${id}`);
};

export const useGetCustomerById = (id: number | string | undefined) => {
	return useQuery({
		queryKey: ["get-customer-by-id", id],
		enabled: !!id,
		queryFn: () => getCustomerById(id),
	});
};
