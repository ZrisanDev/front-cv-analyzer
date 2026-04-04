import { api } from "@/modules/shared/lib/api"
import type { ApiResponse } from "@/modules/shared/types/common"
import type { AnalysisResult } from "@/modules/results/types/results"

export async function getAnalysisResult(analysisId: string): Promise<AnalysisResult> {
  const { data } = await api.get<ApiResponse<AnalysisResult>>(
    `/api/analysis/${analysisId}/results`
  )
  return data.data
}
