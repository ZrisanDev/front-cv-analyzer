import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  getStatsSummary,
  getScoreEvolution,
  getMissingKeywords,
} from "@/modules/dashboard/api/dashboard"
import type { DashboardStats, EvolutionPoint, KeywordCount } from "@/modules/dashboard/types/dashboard"

const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  summary: () => [...DASHBOARD_KEYS.all, "summary"] as const,
  evolution: () => [...DASHBOARD_KEYS.all, "evolution"] as const,
  keywords: () => [...DASHBOARD_KEYS.all, "keywords"] as const,
} as const

export function useDashboardStats() {
  const summary = useQuery({
    queryKey: DASHBOARD_KEYS.summary(),
    queryFn: getStatsSummary,
    staleTime: 5 * 60 * 1000,
  })

  const evolution = useQuery({
    queryKey: DASHBOARD_KEYS.evolution(),
    queryFn: getScoreEvolution,
    staleTime: 5 * 60 * 1000,
  })

  const keywords = useQuery({
    queryKey: DASHBOARD_KEYS.keywords(),
    queryFn: getMissingKeywords,
    staleTime: 5 * 60 * 1000,
  })

  // Transform backend data to match component expectations
  const transformedEvolution: EvolutionPoint[] = (evolution.data?.data_points ?? []).map(
    (point) => ({
      date: point.month,
      score: point.avg_score,
    })
  )

  const transformedKeywords: KeywordCount[] = (keywords.data?.keywords ?? []).map(
    (item) => ({
      keyword: item.keyword,
      count: item.missing_count,
    })
  )

  const isLoading = summary.isLoading || evolution.isLoading || keywords.isLoading

  // Always return data even if some queries fail - use defaults for missing data
  const data: DashboardStats = {
    totalAnalyses: summary.data?.total_analyses ?? 0,
    averageScore: summary.data?.avg_compatibility_score ?? 0,
    evolution: transformedEvolution,
    topMissingKeywords: transformedKeywords,
  }

  return {
    data,
    isLoading,
    error: summary.error || evolution.error || keywords.error,
  }
}
