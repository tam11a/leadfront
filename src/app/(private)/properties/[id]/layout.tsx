import { notFound } from "next/navigation";
import PropertyLayout from "./properties-layout";
import { getProductById } from "@/lib/actions/properties/get-by-id";

export default async function PropertyDetailLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: {
		id: number;
	};
}>) {
	async function getData() {
		try {
			const res = await getProductById(params.id);
			return res.data;
		} catch (error: any) {
			if (error.response?.status === 404) return null;
			else throw new Error(error);
		}
	}

	const data = await getData();

	if (!data || data === null) return notFound();

	return (
		<>
			<PropertyLayout params={params}>{children}</PropertyLayout>
		</>
	);
}
