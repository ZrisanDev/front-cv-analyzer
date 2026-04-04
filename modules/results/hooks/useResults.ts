import { useQuery } from "@tanstack/react-query"
import { getAnalysisResult as getAnalysisResultApi } from "@/modules/results/api/results"

const RESULTS_KEYS = {
  all: ["results"] as const,
  detail: (analysisId: string) => [...RESULTS_KEYS.all, "detail", analysisId] as const,
}

export function useAnalysisResult(analysisId: string | null) {
  return useQuery({
    queryKey: RESULTS_KEYS.detail(analysisId ?? ""),
    queryFn: () => getAnalysisResultApi(analysisId!),
    enabled: !!analysisId,
  })
}
