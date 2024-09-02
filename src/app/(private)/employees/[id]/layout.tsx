import { notFound } from "next/navigation";
import EmployeeLayout from "./employee-layout";
import { getEmployeeById } from "@/lib/actions/employees/get-by-id";

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
      const res = await getEmployeeById(params.id);
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
      <EmployeeLayout params={params}>{children}</EmployeeLayout>
    </>
  );
}
