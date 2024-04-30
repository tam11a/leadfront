"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ui/dropzone";

//icons
import { BiBath, BiBuildingHouse, BiDirections } from "react-icons/bi";
import { GiResize } from "react-icons/gi";
import { TbLocation, TbNewSection, TbRoad } from "react-icons/tb";
import { PiPlaceholderBold } from "react-icons/pi";
import { RiHotelBedLine } from "react-icons/ri";
import { MdBalcony } from "react-icons/md";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";

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
}) {
	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
				<div>
					<span className="flex flex-row gap-2">
						<BiBuildingHouse className="text-primary" />
						<CardTitle>Type</CardTitle>
					</span>
					<CardDescription className="flex items-center space-x-2 px-6 my-2">
						{details.product_typeName === "Land" ||
						details.product_typeName === "Land Share" ? (
							<>{[details.product_typeName, details.land_type].join(", ")} </>
						) : details.product_typeName === "Flat" ? (
							<>
								{[details.product_typeName, details.apartment_type].join(", ")}
							</>
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
							<>{[details.size, details.unitName].join(" ")} </>
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
						<PiPlaceholderBold className="text-primary" />
						<CardTitle>Plot</CardTitle>
					</span>
					<CardDescription className="flex items-center space-x-2 px-6 my-2">
						{details.plot ? <>{details.plot} </> : <>{"No plot added"}</>}
					</CardDescription>
				</div>

				<div className="gap-2">
					<span className="flex flex-row gap-2">
						<BiDirections className="text-primary" />
						<CardTitle>Facing</CardTitle>
					</span>
					<CardDescription className="flex items-center space-x-2 px-6 my-2">
						{details.facing ? (
							<>{details.facing} Facing </>
						) : (
							<>{"No facing available"}</>
						)}
					</CardDescription>
				</div>
				<div className="gap-2">
					<span className="flex flex-row gap-2">
						<HiOutlineSquare3Stack3D className="text-primary" />
						<CardTitle>Floor</CardTitle>
					</span>
					<CardDescription className="flex items-center space-x-2 px-6 my-2">
						{details.floor ? <>{details.floor} </> : <>{"Not available"}</>}
					</CardDescription>
				</div>
				<div className="gap-2">
					<span className="flex flex-row gap-2">
						<RiHotelBedLine className="text-primary" />
						<CardTitle>Bedrooms</CardTitle>
					</span>
					<CardDescription className="flex items-center space-x-2 px-6 my-2">
						{details.bedrooms ? (
							<>{details.bedrooms} </>
						) : (
							<>{"Not available"}</>
						)}
					</CardDescription>
				</div>
				<div className="gap-2">
					<span className="flex flex-row gap-2">
						<BiBath className="text-primary" />
						<CardTitle>Bathrooms</CardTitle>
					</span>
					<CardDescription className="flex items-center space-x-2 px-6 my-2">
						{details.bathrooms ? (
							<>{details.bathrooms} </>
						) : (
							<>{"Not available"}</>
						)}
					</CardDescription>
				</div>
				<div className="gap-2">
					<span className="flex flex-row gap-2">
						<MdBalcony className="text-primary" />
						<CardTitle>Balcony</CardTitle>
					</span>
					<CardDescription className="flex items-center space-x-2 px-6 my-2">
						{details.balcony ? <>{details.balcony} </> : <>{"Not available"}</>}
					</CardDescription>
				</div>
			</div>
			<div className="space-y-6">
				<CardHeader className="p-0">
					<CardTitle>Description</CardTitle>
					<CardDescription>Description about the property</CardDescription>
				</CardHeader>
				{details.description ? (
					<>
						<p>{details?.description}</p>
					</>
				) : (
					""
				)}
			</div>
			{/* <div className="grid gap-4 py-4">
				<ImageUpload />
			</div> */}
		</>
	);
}
