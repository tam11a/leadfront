import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useEmployeeById = (id: number | string | undefined) => {
	return useQuery({
		queryKey: ["get-employee-by-id"],
		enabled: !!id,
		queryFn: () => {
			return instance.get(`/crm-employees/${id}`);
		},
	});
};
