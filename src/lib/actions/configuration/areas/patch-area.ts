import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const update = ({ id, data }: { id: number; data: any }) => {
	return instance.patch(`/crm-areas/${id}`, { ...data });
};

export const useUpdateArea = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: update,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-areas"],
			});
		},
	});
};
