import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";

export default function Settings() {
	return (
		<div className="space-y-8">
			<CardHeader className="p-0">
				<CardTitle>Profile</CardTitle>
				<CardDescription>Update your profile information</CardDescription>
			</CardHeader>
			<ProfileForm />
		</div>
	);
}
