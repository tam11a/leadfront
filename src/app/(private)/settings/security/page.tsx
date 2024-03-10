import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordChangeForm } from "./password-change-form";

export default function Security() {
	return (
		<div className="space-y-8">
			<CardHeader className="p-0">
				<CardTitle>Security</CardTitle>
				<CardDescription>Update your security information</CardDescription>
			</CardHeader>
			<PasswordChangeForm />
		</div>
	);
}
