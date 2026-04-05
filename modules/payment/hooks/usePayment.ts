import { useQuery } from "@tanstack/react-query"
import { getPaymentStatus as getPaymentStatusApi } from "@/modules/payment/api/payment"
import type { PaymentStatus } from "@/modules/payment/types/payment"

const PAYMENT_KEYS = {
  all: ["payment"] as const,
  status: (paymentId: string) => [...PAYMENT_KEYS.all, "status", paymentId] as const,
}

interface UsePaymentStatusOptions {
  /** Enable auto-refetch when status is pending (default: true) */
  pollPending?: boolean
  /** Polling interval in ms when status is pending (default: 5000) */
  pollingInterval?: number
}

export function usePaymentStatus(
  paymentId: string | null,
  options: UsePaymentStatusOptions = {}
) {
  const { pollPending = true, pollingInterval = 5000 } = options

  return useQuery({
    queryKey: PAYMENT_KEYS.status(paymentId ?? ""),
    queryFn: () => getPaymentStatusApi(paymentId!),
    enabled: !!paymentId,
    // Agregar staleTime para dar tiempo al sync endpoint (evita race condition)
    staleTime: 2000,  // 2 segundos de "fresh" antes de consultar
    refetchInterval: (query) => {
      if (!pollPending) return false
      const status = query.state.data?.status as PaymentStatus | undefined
      return status === "pending" ? pollingInterval : false
    },
  })
}
