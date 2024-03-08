"use client";
import { useEffect } from "react";
import { Loading } from "../token-validation-checker";
import { authService } from "@/lib/auth.service";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
	const router = useRouter();
	useEffect(() => {
		authService.removeToken();
		router.replace("/");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return <Loading />;
}
