import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const update = ({ id, data }: { id: number | string; data: any }) => {
	return instance.patch(`/crm-customers/${id}`, { ...data });
};

export const useUpdateCustomer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: update,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-customers"],
			});
			queryClient.invalidateQueries({
				queryKey: ["get-customer-by-id"],
			});
		},
	});
};
