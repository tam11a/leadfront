import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";
// import { revalidatePath } from "next/cache";

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
			queryClient.invalidateQueries({
				queryKey: ["get-customer-logs"],
			});
			// revalidatePath("/app/customers/[id]", "layout");
		},
	});
};
