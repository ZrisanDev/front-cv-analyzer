import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { initiatePayment as initiatePaymentApi, getPrice as getPriceApi, submitAnalysis as submitAnalysisApi } from "@/modules/analysis/api/analysis"
import type { AnalysisPayload, AnalysisSubmitPayload } from "@/modules/analysis/types/analysis"
import toast from "react-hot-toast"
import { ROUTES } from "@/modules/shared/lib/constants"

const ANALYSIS_KEYS = {
  all: ["analysis"] as const,
  price: () => [...ANALYSIS_KEYS.all, "price"] as const,
}

export function usePrice() {
  return useQuery({
    queryKey: ANALYSIS_KEYS.price(),
    queryFn: getPriceApi,
    staleTime: 10 * 60 * 1000, // Price changes infrequently, cache for 10 minutes
  })
}

interface UsePaymentOptions {
  onSuccess?: (paymentUrl: string) => void
}

export function usePayment(options?: UsePaymentOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AnalysisPayload) => initiatePaymentApi(payload),
    onSuccess: (data) => {
      // Invalidate price query in case it changed
      queryClient.invalidateQueries({ queryKey: ANALYSIS_KEYS.price() })
      toast.success("Redirecting to payment...")
      options?.onSuccess?.(data.paymentUrl)
      // Redirect to MercadoPago checkout
      window.location.href = data.paymentUrl
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate payment. Please try again.")
    },
  })
}

interface UseSubmitAnalysisOptions {
  onSuccess?: (analysisId: string) => void
}

export function useSubmitAnalysis(options?: UseSubmitAnalysisOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AnalysisSubmitPayload) => submitAnalysisApi(payload),
    onSuccess: (data) => {
      toast.success("Analysis started successfully!")
      options?.onSuccess?.(data.id)
      // Redirect to results page with query parameter
      window.location.href = `${ROUTES.RESULTS}?id=${data.id}`
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start analysis. Please try again.")
    },
  })
}
