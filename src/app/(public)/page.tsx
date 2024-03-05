import { SignForm } from "./sign-form";

export default function Sign() {
	return (
		<main className="flex flex-row items-center justify-center min-h-screen">
			<div className="max-w-sm mx-auto w-full">
				<SignForm />
			</div>
		</main>
	);
}
