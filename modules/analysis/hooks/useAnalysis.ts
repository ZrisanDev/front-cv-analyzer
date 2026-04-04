import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { initiatePayment as initiatePaymentApi, getPrice as getPriceApi } from "@/modules/analysis/api/analysis"
import type { AnalysisPayload } from "@/modules/analysis/types/analysis"
import toast from "react-hot-toast"

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
