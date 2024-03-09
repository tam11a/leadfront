import { useMutation } from "@tanstack/react-query";
import instance from "..";

const passwordChange = (data: any) => {
	return instance.patch("/auth/password-change", { ...data });
};

export const usePasswordChange = () => {
	return useMutation({ mutationFn: passwordChange });
};
