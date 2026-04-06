"use client"

import { useDashboardStats } from "@/modules/dashboard/hooks/useDashboard"
import { StatsCards } from "@/modules/dashboard/components/StatsCards"
import { ScoreEvolutionChart } from "@/modules/dashboard/components/ScoreEvolutionChart"
import { TopMissingKeywordsChart } from "@/modules/dashboard/components/TopMissingKeywordsChart"
import { CreditOverviewCard } from "@/modules/payment"
import { EmptyState } from "@/modules/shared/components/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats()

  const hasNoAnalyses =
    !isLoading &&
    (data?.totalAnalyses ?? 0) === 0

  if (hasNoAnalyses) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <EmptyState
          icon={BarChart3}
          title="Sin análisis aún"
          description="Subí tu primer CV y comenzá a analizar compatibilidades para ver tus estadísticas aquí."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stats Cards */}
      <StatsCards
        totalAnalyses={data?.totalAnalyses ?? 0}
        averageScore={data?.averageScore ?? 0}
        isLoading={isLoading}
      />

      {/* Credit Overview */}
      <CreditOverviewCard />

      {/* Charts */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ScoreEvolutionChart data={data?.evolution ?? []} />
          <TopMissingKeywordsChart data={data?.topMissingKeywords ?? []} />
        </div>
      )}
    </div>
  )
}
