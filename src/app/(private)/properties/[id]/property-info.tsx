"use client";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { BiBuildingHouse } from "react-icons/bi";

export function PropertyInfo(details: {
  id?: number;
  phone?: string;
  email?: string;
  adress?: string;
  address2?: string;
  product_typeName?: string;
  land_type?: string;
  size?: string;
  unitName?: string;
  block?: string;
  road?: string;
  plot?: string;
  facing?: string;
}) {
  console.log(details);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <span className="flex flex-row gap-2">
          <BiBuildingHouse className="text-primary" />
          <CardTitle>Type</CardTitle>
        </span>
        <CardDescription className="flex items-center space-x-2 px-6 my-2">
          {details.product_typeName ? (
            <>{[details.product_typeName, details.land_type].join(", ")} </>
          ) : (
            <>{"No Property Type Added"}</>
          )}
        </CardDescription>
      </div>
      <div className="gap-2">
        <span className="flex flex-row gap-2">
          <BiBuildingHouse className="text-primary" />
          <CardTitle>Size</CardTitle>
        </span>
        <CardDescription className="flex items-center space-x-2 px-6 my-2">
          {details.product_typeName ? (
            <>{[details.size, details.unitName].join(" ")} </>
          ) : (
            <>{"No Property Type Added"}</>
          )}
        </CardDescription>
      </div>
      <div className="gap-2">
        <span className="flex flex-row gap-2">
          <BiBuildingHouse className="text-primary" />
          <CardTitle>Location</CardTitle>
        </span>
        <CardDescription className="flex items-center space-x-2 px-6 my-2">
          <>
            Block {details.block}, Road {details.road}, {details.adress}
          </>
        </CardDescription>
      </div>
      <div className="gap-2">
        <span className="flex flex-row gap-2">
          <BiBuildingHouse className="text-primary" />
          <CardTitle>Property Size</CardTitle>
        </span>
        <CardDescription className="flex items-center space-x-2 px-6 my-2">
          {details.product_typeName ? (
            <>{[details.size, details.unitName].join(" ")} </>
          ) : (
            <>{"No Property Type Added"}</>
          )}
        </CardDescription>
      </div>
      <div className="gap-2">
        <span className="flex flex-row gap-2">
          <BiBuildingHouse className="text-primary" />
          <CardTitle>Property Size</CardTitle>
        </span>
        <CardDescription className="flex items-center space-x-2 px-6 my-2">
          {details.product_typeName ? (
            <>{[details.size, details.unitName].join(" ")} </>
          ) : (
            <>{"No Property Type Added"}</>
          )}
        </CardDescription>
      </div>
    </div>
  );
}
