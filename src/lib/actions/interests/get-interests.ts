import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useGetInterests = (payloads?: { [key: string]: any }) => {
  return useQuery({
    queryKey: ["get-interests", payloads],
    queryFn: () => {
      return instance.post("/crm-interest", payloads);
    },
    retry: 0,
  });
};
