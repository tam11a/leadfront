import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteInterest = (id: number) => {
	return instance.delete(`/crm-product-interest/${id}`);
};

export const useDeleteInterest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteInterest,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-interests"],
			});
		},
	});
};
