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
    // Format: YYYY-MM from backend
    const [year, month] = dateStr.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return new Intl.DateTimeFormat("es-AR", {
      month: "short",
      year: "2-digit",
    }).format(date)
  } catch {
    return dateStr
  }
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
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <TrendingUp className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No hay análisis completados aún
            </p>
            <p className="text-xs text-muted-foreground/70">
              Cuando completes al menos un análisis, verás tu evolución aquí
            </p>
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
