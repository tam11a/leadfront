import { useMutation } from "@tanstack/react-query";
import instance from "..";

const register = (data: any) => {
	return instance.post("/auth/register", { ...data });
};

export const useRegister = () => {
	return useMutation({ mutationFn: register });
};
