import { api } from "@/modules/shared/lib/api"
import type { ApiResponse } from "@/modules/shared/types/common"
import type { UserCredits, CreditPackage, PaymentPreference, PackageType } from "@/modules/payment/types/payment"

export async function getCredits(): Promise<UserCredits> {
  const { data } = await api.get<ApiResponse<UserCredits>>(
    "/api/payments/my-credits"
  )
  return data.data
}

export async function getPackages(): Promise<CreditPackage[]> {
  const { data } = await api.get<ApiResponse<CreditPackage[]>>(
    "/api/payments/credit-packages"
  )
  return data.data
}

export async function createPackagePreference(
  packageType: PackageType
): Promise<PaymentPreference> {
  const { data } = await api.post<ApiResponse<PaymentPreference>>(
    "/api/payments/create-package-preference",
    { package_type: packageType }
  )
  return data.data
}

export async function getPaymentDetails(
  paymentId: string
): Promise<PaymentPreference> {
  const { data } = await api.get<ApiResponse<PaymentPreference>>(
    `/api/payments/${paymentId}`
  )
  return data.data
}
