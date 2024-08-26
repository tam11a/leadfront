import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetInterests = (payloads?: { [key: string]: any }) => {
	return useQuery({
		queryKey: ["get-interests-v1", payloads],
		queryFn: () => {
			return instance.post("/crm-interest", payloads);
		},
		retry: 0,
	});
};

export const useGetInterestsList = (payloads?: { [key: string]: any }) => {
	return useQuery({
		queryKey: ["get-interests", payloads],
		queryFn: () => {
			return instance.get("/crm-product-interest", {
				params: payloads,
			});
		},
		retry: 0,
	});
};
