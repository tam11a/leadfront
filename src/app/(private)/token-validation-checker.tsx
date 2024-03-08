"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useUser from "@/hooks/useUser";
import { authService } from "@/lib/auth.service";
import { useRouter } from "next/navigation";

const Loading = () => {
	return (
		<div className="h-svh w-svw max-w-xs mx-auto flex flex-col items-center justify-center space-y-3">
			<Skeleton className="h-[125px] w-[250px] rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		</div>
	);
}; // This is a loading state

const TokenValidationChecker = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	// Check if the user is logged in
	const { isLoading, isError, error } = useUser();
	const router = useRouter();

	if (isLoading) {
		return <Loading />;
	}

	if (isError) {
		// @ts-ignore
		if (error?.response?.status !== 401) throw new Error(error?.message);
		else {
			authService.removeToken();
			router.replace("/");
		}
		return (
			<>
				<Loading />
			</>
		);
	}

	return <>{children}</>;
};

export default TokenValidationChecker;
