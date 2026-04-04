"use client"

import { FileText, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsCardsProps {
  totalAnalyses: number
  averageScore: number
  isLoading: boolean
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards({
  totalAnalyses,
  averageScore,
  isLoading,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Total Análisis */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="size-5 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total Análisis
              </span>
              <span className="text-3xl font-bold tabular-nums">
                {totalAnalyses}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promedio de Compatibilidad */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Target className="size-5 text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Promedio de Compatibilidad
              </span>
              <span className="text-3xl font-bold tabular-nums">
                {Math.round(averageScore)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
