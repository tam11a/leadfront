import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetLog = (params?: { user: number | string | undefined }) => {
	return useQuery({
		queryKey: ["get-employee-log", params],
		enabled: !!params,
		select(data) {
			return data?.data;
		},
		queryFn: () => {
			return instance.get(`/auth/log`, {
				params,
			});
		},
	});
};
