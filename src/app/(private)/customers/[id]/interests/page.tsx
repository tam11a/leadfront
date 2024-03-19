export default async function CustomerInterestsPage({
	params,
}: {
	params: {
		id: number;
	};
}) {
	return <>Interest of #{params.id}</>;
}
