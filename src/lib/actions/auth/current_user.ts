import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ["current-user"],
		queryFn: () => {
			return instance.get("/auth/current_user");
		},
	});
};
