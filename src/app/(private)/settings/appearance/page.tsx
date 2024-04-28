import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeSwitch from "./theme-switch";

export default function Appearance() {
	return (
		<div>
			<CardHeader className="p-0">
				<CardTitle>Appearance</CardTitle>
				<CardDescription>Update your appearance information</CardDescription>
			</CardHeader>
			<div className="space-y-4 my-6">
				<ThemeSwitch />
			</div>
		</div>
	);
}
