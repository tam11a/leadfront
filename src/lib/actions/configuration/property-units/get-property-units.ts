import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const useGetPropertyUnits = (search?: string) => {
	return useQuery({
		queryKey: ["get-property-units", search],
		queryFn: () => {
			return instance.get(`/crm-units`, {});
		},
	});
};
