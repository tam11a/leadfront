import { useMutation } from "@tanstack/react-query";
import instance from "..";

const login = (data: any) => {
	return instance.post("/auth/login", { ...data });
};

export const useLogin = () => {
	return useMutation({ mutationFn: login });
};
