import { useQuery } from "@tanstack/react-query";
import instance from "..";

// export const useEmployeeById = (id: number | string | undefined) => {
//   return useQuery({
//     queryKey: ["get-employee-by-id", id],
//     enabled: !!id,
//     queryFn: () => {
//       return instance.get(`/crm-employees/${id}`);
//     },
//   });
// };

export const getEmployeeById = async (id: number | string | undefined) => {
  return instance.get(`/crm-employees/${id}`);
};

export const useGetEmployeeById = (id: number | string | undefined) => {
  return useQuery({
    queryKey: ["get-employee-by-id", id],
    enabled: !!id,
    queryFn: () => getEmployeeById(id),
  });
};
