"use client";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { PropertyInfo } from "./property-info";
import { useGetProductById } from "@/lib/actions/properties/get-by-id";
import { Loading } from "../../token-validation-checker";

export default function PropertyInfoPage({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { data } = useGetProductById(params.id);

  return !data ? (
    <Loading />
  ) : (
    <div className="space-y-8">
      <CardHeader className="p-0">
        <CardTitle>Information</CardTitle>
        <CardDescription>Information about the property</CardDescription>
      </CardHeader>
      <PropertyInfo
        {...{
          id: params?.id,
          phone: data?.data?.phone,
          email: data?.data?.email,
          address: data?.data?.adress,
          address2: data?.data?.adress2,
          product_typeName: data?.data?.product_typeName,
          land_type: data?.data?.land_type,
          size: data?.data?.size,
          unitName: data?.data?.unitName,
          block: data?.data?.block,
          road: data?.data?.road,
          plot: data?.data?.plot,
          facing: data?.data?.facing,
        }}
      />
    </div>
  );
}
