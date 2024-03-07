"use client";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/lib/actions/auth/current_user";

export default function Settings() {
	const { data } = useCurrentUser();
	console.log(data);
	return (
		<div>
			<CardHeader className="p-0">
				<CardTitle>Profile</CardTitle>
				<CardDescription>Update your profile information</CardDescription>
			</CardHeader>
		</div>
	);
}
