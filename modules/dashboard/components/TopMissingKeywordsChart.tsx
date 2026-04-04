"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AlertTriangle } from "lucide-react"
import type { KeywordCount } from "@/modules/dashboard/types/dashboard"

const chartConfig = {
  count: {
    label: "Frecuencia",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface TopMissingKeywordsChartProps {
  data: KeywordCount[]
}

export function TopMissingKeywordsChart({
  data,
}: TopMissingKeywordsChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <CardTitle>Keywords Faltantes Recurrentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center text-sm text-muted-foreground">
            ¡Genial! No hay keywords faltantes recurrentes
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                type="category"
                dataKey="keyword"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={120}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
