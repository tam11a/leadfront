import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const deleteArea = (id: number) => {
	return instance.delete(`/crm-areas/${id}`);
};

export const useDeleteArea = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteArea,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-areas"],
			});
		},
	});
};
