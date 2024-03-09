import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const create = (data: any) => {
	return instance.post(`/crm-areas`, { ...data });
};

export const useCreateArea = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: create,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-areas"],
			});
		},
	});
};
