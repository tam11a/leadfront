"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Overview } from "./overview";
import { useGetStats } from "@/lib/actions/dashboard/get-dashboard-stats";

//Icons
import {
  BsPersonAdd,
  BsPerson,
  BsPersonCheck,
  BsPersonGear,
  BsPersonLock,
  BsPersonUp,
  BsPersonExclamation,
} from "react-icons/bs";
import { MdMoreVert, MdOutlinePerson2 } from "react-icons/md";
import { TbHome, TbHomeCheck, TbHomeDollar, TbHomeDot } from "react-icons/tb";
import FollowupsToday from "./followups-today";

export default function Dashboard() {
  const { data: statsData, isLoading: statsDataLoading } = useGetStats();
  return (
    <main>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button size={"icon"} variant={"outline"} className="flex md:hidden">
            <MdMoreVert />
          </Button>
          <div className="hidden md:flex items-center space-x-2">
            {/* <CalendarDateRangePicker /> */}
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList> */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Customers
                  </CardTitle>
                  <BsPersonAdd className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.raw_customers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total new customers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Customers
                  </CardTitle>
                  <MdOutlinePerson2 className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.active_customers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total active customers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Booked Customers
                  </CardTitle>
                  <BsPersonGear className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.booked_customers}
                  </div>
                  <p className="text-xs  text-muted-foreground">
                    Total customers booked
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Priority Customers
                  </CardTitle>
                  <BsPersonExclamation className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.priority_customers}
                  </div>
                  <p className="text-xs  text-muted-foreground">
                    Total priority customers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Prospect Customers
                  </CardTitle>
                  <BsPerson className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.prospect_customers}
                  </div>
                  <p className="text-xs  text-muted-foreground">
                    Total prospect customers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    High Prospect Customers
                  </CardTitle>
                  <BsPersonUp className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.booked_customers}
                  </div>
                  <p className="text-xs  text-muted-foreground">
                    Total customers booked
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Customers
                  </CardTitle>
                  <BsPersonCheck className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.sold_customers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total completed customers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Closed Customers
                  </CardTitle>
                  <BsPersonLock className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.closed_customers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total closed customers
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Properties
                  </CardTitle>
                  <TbHome className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.properties}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total properties
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Properties
                  </CardTitle>
                  <TbHomeDot className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.raw_properties}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total new properties
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Available Properties
                  </CardTitle>
                  <TbHomeCheck className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.available_properties}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total available properties
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Properties Sold
                  </CardTitle>
                  <TbHomeDollar className="h-4 w-4  " />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-2xl font-bold gap-1">
                    {statsData?.data?.sold_properties}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total properties sold
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Today&apos;s Followup</CardTitle>
                  <CardDescription>
                    You have {statsData?.data?.followups_today?.length}{" "}
                    followups today.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FollowupsToday
                    data={statsData?.data?.followups_today || []}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
