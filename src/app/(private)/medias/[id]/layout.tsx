import { notFound } from "next/navigation";
import MediaLayout from "./media-layout";
import { getMediaById } from "@/lib/actions/media/get-by-id";

export default async function MediaDetailLayout({
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
      const res = await getMediaById(params.id);
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
      <MediaLayout params={params}>{children}</MediaLayout>
    </>
  );
}
