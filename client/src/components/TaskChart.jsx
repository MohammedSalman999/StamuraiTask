"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--sapphire))", // Sapphire color
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--emerald))", // Emerald color
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--orange))", // Orange color
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--ruby))", // Ruby color
  },
}

export default function TaskChart({ data, title, description }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Transform data to match the expected format
  const transformedData = data.map((item) => ({
    ...item,
    month: `${item.month} ${item.year}`,
    completed: item.finished, // Map finished to completed for the chart
    cancelled: item.cancelled || 0, // Ensure cancelled has a default value
  }))

  // Get the last 6 months of data
  const last6MonthsData = transformedData.slice(-6)

  // Format X-axis tick based on screen size
  const formatXAxisTick = (value) => {
    const [month, year] = value.split(" ")
    if (windowWidth < 640) {
      return month.slice(0, 1) // First letter for small screens
    } else if (windowWidth < 1024) {
      return `${month.slice(0, 3)} ${year.slice(2)}` // Short month and 2-digit year for medium screens
    }
    return value // Full value for large screens
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="py-0 sm:py-1">
        <CardTitle className="p-0 text-lg sm:text-xl font-bold text-center">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="py-0 sm:py-2">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[300px] md:h-[350px] w-full">
          <BarChart data={last6MonthsData} margin={{ right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={formatXAxisTick}
              fontSize={windowWidth < 640 ? 8 : windowWidth < 1024 ? 8 : 10}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={5}
              fontSize={windowWidth < 640 ? 8 : windowWidth < 1024 ? 8 : 10}
            />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} content={<ChartTooltipContent indicator="dashed" />} />

            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="pending"
              fill={chartConfig.pending.color}
              radius={[4, 4, 0, 0]}
              barSize={windowWidth < 640 ? 10 : windowWidth < 1024 ? 15 : 20}
              name={chartConfig.pending.label}
            />
            <Bar
              dataKey="total"
              fill={chartConfig.total.color}
              radius={[4, 4, 0, 0]}
              barSize={windowWidth < 640 ? 10 : windowWidth < 1024 ? 15 : 20}
              name={chartConfig.total.label}
            />
            <Bar
              dataKey="completed"
              fill={chartConfig.completed.color}
              radius={[4, 4, 0, 0]}
              barSize={windowWidth < 640 ? 10 : windowWidth < 1024 ? 15 : 20}
              name={chartConfig.completed.label}
            />
            <Bar
              dataKey="cancelled"
              fill={chartConfig.cancelled.color}
              radius={[4, 4, 0, 0]}
              barSize={windowWidth < 640 ? 10 : windowWidth < 1024 ? 15 : 20}
              name={chartConfig.cancelled.label}
            />
          </BarChart>
        </ChartContainer>
        <CardFooter className="flex flex-col items-start gap-2 text-xs sm:text-sm sm:py-2">
          <div className="text-muted-foreground">
            This chart shows the total, completed, pending and cancelled tasks for each month over the last 6 months.
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
