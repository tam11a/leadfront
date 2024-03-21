import { getCustomerById } from "@/lib/actions/customers/get-by-id";
import { notFound } from "next/navigation";
import ClientLayout from "./client-layout";

export default async function CustomerDetailLayout({
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
			const res = await getCustomerById(params.id);
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
			<ClientLayout params={params}>{children}</ClientLayout>
		</>
	);
}
