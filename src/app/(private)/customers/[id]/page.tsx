export default async function CustomerDetailsPage({
	params,
}: {
	params: {
		id: number;
	};
}) {
	return <>Hello #{params.id}</>;
}
