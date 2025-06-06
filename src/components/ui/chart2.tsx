"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  ChartConfig,
} from "@/components/ui/chart"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { month: "January", completed: 186, incomplete: 80 },
  { month: "February", completed: 305, incomplete: 200 },
  { month: "March", completed: 237, incomplete: 120 },
  { month: "April", completed: 73, incomplete: 190 },
  { month: "May", completed: 209, incomplete: 130 },
  { month: "June", completed: 214, incomplete: 140 },
  { month: "July", completed: 190, incomplete: 150 },
  { month: "August", completed: 220, incomplete: 160 },
  { month: "September", completed: 180, incomplete: 110 },
  { month: "October", completed: 250, incomplete: 180 },
  { month: "November", completed: 210, incomplete: 125 },
  { month: "December", completed: 280, incomplete: 170 },
];


const chartConfig: ChartConfig = {
  completed: {
    label: "Selesai",
    color: "#2b7fff",
  },
  incomplete: {
    label: "Belum Selesai",
    color: "#8ec5ff",
  },
}

export function Chart2() {
  return (
    <Card>
  <CardHeader>
    <CardTitle>Progress Tugas - Stacked + Legend</CardTitle>
    <CardDescription>Januari - Desember 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="completed"
          stackId="a"
          fill="var(--color-completed)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="incomplete"
          stackId="a"
          fill="var(--color-incomplete)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  </CardContent>
  <CardFooter className="flex-col items-start gap-2 text-sm">
    <div className="flex gap-2 leading-none font-medium">
      Produktivitas naik 5.2% bulan ini <TrendingUp className="h-4 w-4" />
    </div>
    <div className="text-muted-foreground leading-none">
      Menampilkan total tugas selama 12 bulan terakhir
    </div>
  </CardFooter>
</Card>

  )
}
