import { api } from "@/modules/shared/lib/api"
import type { ApiResponse } from "@/modules/shared/types/common"
import type { UserCredits, CreditPackage, PaymentPreference, PackageType } from "@/modules/payment/types/payment"

export async function getCredits(): Promise<UserCredits> {
  const response = await api.get<UserCredits | ApiResponse<UserCredits>>(
    "/api/payments/my-credits"
  )

  // Handle both direct response and wrapped ApiResponse
  const data = response.data
  if (data && 'data' in data && typeof data.data === 'object') {
    return data.data as UserCredits
  } else {
    return data as UserCredits
  }
}

export async function getPackages(): Promise<CreditPackage[]> {
  const response = await api.get<CreditPackage[] | ApiResponse<CreditPackage[]>>(
    "/api/payments/credit-packages"
  )

  // El backend retorna el array directamente, no el wrapper ApiResponse
  const data = response.data

  if (Array.isArray(data)) {
    return data
  } else if (data && 'data' in data && Array.isArray(data.data)) {
    return data.data
  } else {
    throw new Error("Invalid response format from API")
  }
}

export async function createPackagePreference(
  packageType: PackageType
): Promise<PaymentPreference> {
  // El backend retorna PaymentPreference directo, no wrapper ApiResponse<PaymentPreference>
  const response = await api.post<PaymentPreference | ApiResponse<PaymentPreference>>(
    "/api/payments/create-package-preference",
    { package_type: packageType }
  ) as unknown

  // Verificamos si es ApiResponse wrapper o objeto directo
  if (response && typeof response === 'object' && 'data' in (response as any)) {
    return (response as ApiResponse<PaymentPreference>).data
  } else {
    // Es el objeto directo del backend
    return response as PaymentPreference
  }
}

export async function getPaymentDetails(
  paymentId: string
): Promise<PaymentPreference> {
  const { data } = await api.get<ApiResponse<PaymentPreference>>(
    `/api/payments/${paymentId}`
  )
  return data.data
}
