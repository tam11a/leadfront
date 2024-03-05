import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/toggle-theme";

export default function Home() {
	return (
		<main className="flex flex-row gap-3 p-5">
			<Button variant={"default"}>Click me</Button>
			<Button variant={"destructive"}>Click me</Button>
			<Button variant={"ghost"}>Click me</Button>
			<Button variant={"outline"}>Click me</Button>
			<Button variant={"secondary"}>Click me</Button>
			<ModeToggle />
		</main>
	);
}
