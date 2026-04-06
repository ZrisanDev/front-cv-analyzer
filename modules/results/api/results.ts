import { api } from "@/modules/shared/lib/api"
import type { AnalysisResult } from "@/modules/results/types/results"

export async function getAnalysisResult(analysisId: string): Promise<AnalysisResult> {
  const { data } = await api.get<AnalysisResult>(
    `/api/analysis/${analysisId}/status`
  )
  return data
}
