"use client"

import { Card } from "antd"
import { TrendingUp } from "lucide-react"
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, Legend } from "recharts"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export function ChartBarStackedAntd() {
  return (
    <Card
      title="Bar Chart - Stacked + Legend"
      extra="January - June 2024"
      style={{ width: "100%" }}
    >
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={(value) => value.slice(0, 3)}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="desktop" stackId="a" fill="#1890ff" />
        <Bar dataKey="mobile" stackId="a" fill="#ffc107" />
      </BarChart>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: "500", display: "flex", alignItems: "center", gap: 6 }}>
          Trending up by 5.2% this month <TrendingUp  />
        </div>
        <div style={{ color: "#888" }}>Showing total visitors for the last 6 months</div>
      </div>
    </Card>
  )
}
