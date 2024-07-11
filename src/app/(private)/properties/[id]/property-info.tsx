"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import ImageUpload from "@/components/ui/dropzone";

//icons
import { BiBuildingHouse } from "react-icons/bi";
import { GiResize } from "react-icons/gi";
import { TbNewSection, TbRoad } from "react-icons/tb";
import { PiPlaceholderBold } from "react-icons/pi";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { AiOutlineApartment } from "react-icons/ai";
import { useGetPropertyUnitsById } from "@/lib/actions/configuration/property-units/get--by-id";
import { usePropertyTypesById } from "@/lib/actions/configuration/property-types/get-by-id";

export function PropertyInfo(details: {
  id?: number;
  phone?: string;
  email?: string;
  address?: string;
  address2?: string;
  product_typeName?: string;
  land_type?: string;
  size?: string;
  unitName?: string;
  block?: string;
  road?: string;
  sector?: string;
  plot?: string;
  facing?: string;
  apartment_type?: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  balcony?: number;
  description?: string;
  attributes?: any;
  product_type?: number;
  unit?: string;
  area?: number;
}) {
  const { data: unitData } = useGetPropertyUnitsById(details?.unit);
  const { data: typeData } = usePropertyTypesById(details?.product_type);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <div>
          <span className="flex flex-row gap-2">
            <BiBuildingHouse className="text-primary" />
            <CardTitle>Type</CardTitle>
          </span>
          <CardDescription className="flex items-center space-x-2 px-6 my-2">
            {typeData?.data?.product_type_name ? (
              <>{typeData?.data?.product_type_name} </>
            ) : (
              <>{"No property type added"}</>
            )}
          </CardDescription>
        </div>
        <div className="gap-2">
          <span className="flex flex-row gap-2">
            <GiResize className="text-primary" />
            <CardTitle>Size</CardTitle>
          </span>
          <CardDescription className="flex items-center space-x-2 px-6 my-2 lowercase">
            {details.size ? (
              <>{[details.size, unitData?.data?.unit_name].join(" ")} </>
            ) : (
              <>{"No property size added"}</>
            )}
          </CardDescription>
        </div>
        <div className="gap-2">
          <span className="flex flex-row gap-2">
            <TbNewSection className="text-primary" />
            <CardTitle>Block</CardTitle>
          </span>
          <CardDescription className="flex items-center space-x-2 px-6 my-2">
            {details.block ? <>{details.block} </> : <>{"No block added"}</>}
          </CardDescription>
        </div>
        <div className="gap-2">
          <span className="flex flex-row gap-2">
            <TbRoad className="text-primary" />
            <CardTitle>Road</CardTitle>
          </span>
          <CardDescription className="flex items-center space-x-2 px-6 my-2">
            {details.road ? <>{details.road} </> : <>{"No road added"}</>}
          </CardDescription>
        </div>
        <div className="gap-2">
          <span className="flex flex-row gap-2">
            <AiOutlineApartment className="text-primary" />
            <CardTitle>Sector</CardTitle>
          </span>
          <CardDescription className="flex items-center space-x-2 px-6 my-2">
            {details.sector ? <>{details.sector} </> : <>{"No sector added"}</>}
          </CardDescription>
        </div>
        <div className="gap-2">
          <span className="flex flex-row gap-2">
            <PiPlaceholderBold className="text-primary" />
            <CardTitle>Plot</CardTitle>
          </span>
          <CardDescription className="flex items-center space-x-2 px-6 my-2">
            {details.plot ? <>{details.plot} </> : <>{"No plot added"}</>}
          </CardDescription>
        </div>
        {details?.attributes?.map((a: any) => (
          <div className="gap-2">
            <span className="flex flex-row gap-2">
              <HiOutlineSquare3Stack3D className="text-primary" />
              <CardTitle>{a?.attribute__name}</CardTitle>
            </span>
            <CardDescription className="flex items-center space-x-2 px-6 my-2">
              {a.value ? <>{a.value} </> : <>{"Not available"}</>}
            </CardDescription>
          </div>
        ))}
      </div>
      {details.description && (
        <div className="space-y-6">
          <CardHeader className="p-0">
            <CardTitle>Description</CardTitle>
            <CardDescription>Description about the property</CardDescription>
          </CardHeader>
          <p>{details?.description}</p>
        </div>
      )}
      {/* <div className="grid gap-4 py-4">
				<ImageUpload />
			</div> */}
    </>
  );
}
