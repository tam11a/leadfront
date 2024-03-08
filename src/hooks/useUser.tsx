"use client";

import { useCurrentUser } from "@/lib/actions/auth/current_user";

const useUser = () => {
	const { data, isLoading, isError, error } = useCurrentUser();

	return {
		user: data,
		isLoading,
		isError,
		error,
	};
};

export default useUser;
