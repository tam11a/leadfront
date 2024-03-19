export default async function CustomerLogsPage({
	params,
}: {
	params: {
		id: number;
	};
}) {
	return <div>Logs of #{params.id}</div>;
}
