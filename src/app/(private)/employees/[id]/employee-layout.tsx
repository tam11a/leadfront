"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Loading } from "../../token-validation-checker";
import { UpdateEmployee } from "../update-employee";
import EmployeeSideDetails from "./side-details";
import TabNav from "./tab-nav";
import { useGetEmployeeById } from "@/lib/actions/employees/get-by-id";

export default function EmployeeLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
  const { data } = useGetEmployeeById(params.id);
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

          <UpdateEmployee employeeId={params.id}>
            <Button variant={"outline"}>Update</Button>
          </UpdateEmployee>
        </div>

        <Separator />
        <div className="flex h-full flex-1 relative flex-col-reverse md:flex-row items-start md:justify-between">
          <div className="flex-1 px-7 py-6">
            <div className="mb-6">
              <TabNav />
            </div>
            <div>{children}</div>
          </div>
          <EmployeeSideDetails
            {...{
              id: params?.id,
              employee_uid: data?.data?.employee_uid,
              email: data?.data?.email,
              address: data?.data?.address,
              address2: data?.data?.address2,
              gender: data?.data?.gender,
              dob: data?.data?.dob,
              nid: data?.data?.nid,
              phone: data?.data?.phone,
              salary: data?.data?.salary,
              tin: data?.data?.tin,
              bank_account_number: data?.data?.bank_account_number,
            }}
          />
        </div>
      </div>
    </>
  );
}
