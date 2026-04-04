import { api } from "@/modules/shared/lib/api"
import type { StatsSummary, ScoreEvolution, MissingKeywordStats } from "@/modules/stats/types/stats"

export async function getStatsSummary(): Promise<StatsSummary> {
  const { data } = await api.get<StatsSummary>("/api/stats/summary")
  return data
}

export async function getScoreEvolution(): Promise<ScoreEvolution> {
  const { data } = await api.get<ScoreEvolution>("/api/stats/evolution")
  return data
}

export async function getMissingKeywords(): Promise<MissingKeywordStats> {
  const { data } = await api.get<MissingKeywordStats>("/api/stats/missing-keywords")
  return data
}
