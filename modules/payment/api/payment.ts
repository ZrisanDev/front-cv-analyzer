import { api } from "@/modules/shared/lib/api"
import type { ApiResponse } from "@/modules/shared/types/common"
import type { PaymentStatusResponse } from "@/modules/payment/types/payment"

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  const { data } = await api.get<ApiResponse<PaymentStatusResponse>>(
    "/api/payment/status",
    { params: { payment_id: paymentId } }
  )
  return data.data
}
