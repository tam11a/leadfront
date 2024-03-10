"use client";

import { useCurrentUser } from "@/lib/actions/auth/current_user";
import { useEmployeeById } from "@/lib/actions/employees/get-by-id";

const useUser = () => {
	const { data, isLoading, isError, error } = useCurrentUser();
	const {
		data: emp_data,
		isLoading: emp_isLoading,
		isError: emp_isError,
		error: emp_error,
	} = useEmployeeById(data?.data?.user_id);

	return {
		user: emp_data,
		access: data,
		isLoading: isLoading || emp_isLoading,
		isError: isError || emp_isError,
		error: error || emp_error,
	};
};

export default useUser;
