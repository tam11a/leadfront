import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const register = (data: any) => {
	return instance.post("/auth/register", { ...data });
};

export const useRegister = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: register,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-employees"],
			});
		},
	});
};
