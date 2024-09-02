"use client";

import { useGetCustomerById } from "@/lib/actions/customers/get-by-id";
// import { UpdateCustomer } from "../update-customer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
// import TabNav from "./tab-nav";
// import CustomerContactBar from "./contact";
import { Loading } from "../../token-validation-checker";
import { UpdateEmployee } from "../update-employee";
import { useEmployeeById } from "@/lib/actions/employees/get-by-id";
import EmployeeSideDetails from "./side-details";
import TabNav from "./tab-nav";
// import CustomerLogsPage from "./logs/log-list";

export default function EmployeeLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
  const { data } = useEmployeeById(params.id);
  console.log(data);
  return !data ? (
    <Loading />
  ) : (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-row items-start md:items-center justify-between py-5 px-8">
          <div className="space-y-1">
            <h1 className="text-sm font-semibold text-muted-foreground">
              Employee Details #{params.id}
            </h1>
            <p className="text-xl font-bold">
              {[data?.data.first_name, data?.data.last_name].join(" ")}{" "}
              {data?.data.gender === "Male"
                ? "(He/Him)"
                : data?.data.gender === "Female"
                ? "(She/Her)"
                : ""}
            </p>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Last Updated: {format(data?.data.updated_at, "PPP")}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Created: {format(data?.data.created_at, "PPP")}
              </p>
            </div>
          </div>

          <div className="md:flex flex-row items-start gap-3">
            {/* <TabNav /> */}
            <UpdateEmployee employeeId={params.id}>
              <Button variant={"outline"}>Update</Button>
            </UpdateEmployee>
          </div>
        </div>

        <Separator />
        <div className="flex h-full flex-1 relative flex-col-reverse md:flex-row items-start md:justify-between">
          <div className="flex-1 px-7 py-6">
            <div className="mb-10">
              <TabNav />
            </div>
            <div>{children}</div>
          </div>
          <EmployeeSideDetails
            {...{
              id: params?.id,
              publicPrice: data?.data?.price_public,
              privatePrice: data?.data?.price_private,
              address: data?.data?.adress,
              areaName: data?.data?.areaName,
              address2: data?.data?.address2,
              size: data?.data?.size,
              unitName: data?.data?.unitName,
              media_id: data?.data?.media_id,
              media_commision: data?.data?.media_commision,
              remarks: data?.data?.remarks,
            }}
          />
        </div>
      </div>
    </>
  );
}
