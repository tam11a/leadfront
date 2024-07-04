"use client";

import { useCurrentUser } from "@/lib/actions/auth/current_user";
import { useEmployees } from "@/lib/actions/employees/users";
import React from "react";

const useUser = () => {
	const { data, isLoading, isError, error } = useCurrentUser();
	const {
		data: emp_data,
		isLoading: emp_isLoading,
		isError: emp_isError,
		error: emp_error,
	} = useEmployees(
		{
			user_id: data?.data?.user_id,
		},
		!!data?.data?.user_id
	);

	const user = React.useMemo(() => {
		if (!emp_data) return undefined;

		return emp_data?.data?.length ? emp_data?.data?.[0] : undefined;
	}, [emp_data]);

	return {
		user,
		access: data,
		isLoading: isLoading || emp_isLoading,
		isError: isError || emp_isError,
		error: error || emp_error,
	};
};

export default useUser;
