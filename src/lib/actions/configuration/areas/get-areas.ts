import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const useGetAreas = (search?: string) => {
	return useQuery({
		queryKey: ["get-areas"],
		queryFn: () => {
			return instance.get(`/crm-areas`, {
				params: {
					search,
				},
			});
		},
	});
};
