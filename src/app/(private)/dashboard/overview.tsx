"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  customers: {
    label: "Customers",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};
export function Overview({ data }: { data: any }) {
  return (
    <ChartContainer config={chartConfig}>
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="customers" hideLabel />}
        />
        <Pie
          data={Object.entries(data)
            .filter((d) => d[0].includes("customers") && (d[1] as number) > 0)
            .flatMap((d) => ({
              status: d[0]?.replace("_customers", "")?.replaceAll("_", " "),
              customers: d[1],
              fill: stringToColour(d[0]),
            }))}
          dataKey="customers"
        >
          <LabelList
            dataKey="status"
            className="fill-background"
            stroke="none"
            fontSize={16}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
