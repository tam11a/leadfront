"use client";
import { useEffect } from "react";
import { Loading } from "../token-validation-checker";
import { authService } from "@/lib/auth.service";
import { useRouter } from "next/navigation";
import { useLogout } from "@/lib/actions/auth/sign-out";

export default function LogoutPage() {
	const router = useRouter();
	const { mutateAsync } = useLogout();

	const logout = async () => {
		try {
			await mutateAsync({
				refresh_token: authService.getRefreshToken(),
			});
		} catch (err) {
			console.error(err);
		}
		authService.removeToken();
		router.refresh();
	};

	useEffect(() => {
		logout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Loading />;
}
