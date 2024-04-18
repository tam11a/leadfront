import { useMutation } from "@tanstack/react-query";
import instance from "..";

export const logout = (data: any) => {
	return instance.post("/auth/logout", { ...data });
};

export const useLogout = () => {
	return useMutation({ mutationFn: logout });
};
