import { useQuery } from "@tanstack/react-query"
import { getAnalysisResult as getAnalysisResultApi } from "@/modules/results/api/results"
import type { AnalysisResult } from "../types/results"

const RESULTS_KEYS = {
  all: ["results"] as const,
  detail: (analysisId: string) => [...RESULTS_KEYS.all, "detail", analysisId] as const,
}

// Poll every 5 seconds when status is pending or processing
const POLLING_INTERVAL = 5000

// Terminal statuses that should stop polling
const TERMINAL_STATUSES = ["completed", "failed", "error"] as const

function shouldContinuePolling(data: AnalysisResult | undefined): boolean {
  if (!data || !data.status) return true // Keep polling if we don't have data or status yet

  const status = data.status.toLowerCase()

  // Stop polling if status is terminal
  if (TERMINAL_STATUSES.includes(status as any)) {
    return false
  }

  // Continue polling for pending or processing
  return status === "pending" || status === "processing"
}

export function useAnalysisResult(analysisId: string | null) {
  return useQuery({
    queryKey: RESULTS_KEYS.detail(analysisId ?? ""),
    queryFn: () => getAnalysisResultApi(analysisId!),
    enabled: !!analysisId,
    refetchInterval: (data) => {
      // If data is undefined, we don't know the status yet, so poll
      if (!data) return POLLING_INTERVAL

      // Check if we should continue polling based on status
      return shouldContinuePolling(data) ? POLLING_INTERVAL : false
    },
  })
}
