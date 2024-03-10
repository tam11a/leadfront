import { useMutation } from "@tanstack/react-query";
import instance from "..";

const update = ({ id, data }: { id: number | string; data: any }) => {
	return instance.patch(`/crm-employees/${id}`, { ...data });
};

export const useUpdateEmployee = () => {
	return useMutation({ mutationFn: update });
};
