import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useEmployees = () => {
	return useQuery({
		queryKey: ["get-employees"],
		queryFn: () => {
			return instance.get("/crm-employees");
		},
	});
};
