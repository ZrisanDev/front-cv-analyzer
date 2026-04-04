"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import type { EvolutionPoint } from "@/modules/dashboard/types/dashboard"

const chartConfig = {
  score: {
    label: "Compatibilidad",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatDate(dateStr: string): string {
  try {
    // Use Temporal.PlainDate if available, fallback to Intl
    if (typeof Temporal !== "undefined") {
      const date = Temporal.PlainDate.from(dateStr.slice(0, 10))
      return date.toLocaleString("es-AR", {
        day: "2-digit",
        month: "short",
      })
    }
  } catch {
    // Temporal not available or parse failed, fallback below
  }

  // Intl fallback
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(date)
}

interface ScoreEvolutionChartProps {
  data: EvolutionPoint[]
}

export function ScoreEvolutionChart({ data }: ScoreEvolutionChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <CardTitle>Evolución de Compatibilidad</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <div className="flex items-center justify-center py-12 text-center text-sm text-muted-foreground">
            Completa más análisis para ver tu evolución
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      formatDate(String(label))
                    }
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-score)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
