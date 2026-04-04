export type PaymentStatus = 'approved' | 'rejected' | 'pending' | 'error'

export interface CallbackQuery {
  collection_id?: string
  status?: string
  payment_id?: string
  merchant_order_id?: string
  external_reference?: string
  preference_id?: string
}

export interface PaymentStatusResponse {
  paymentId: string
  status: PaymentStatus
  analysisId?: string
  amount?: number
  currency?: string
  dateApproved?: string
  payerEmail?: string
}

export interface PaymentCreate {
  amount: number | null
}

export interface PreferenceResponse {
  preference_id: string
  payment_url: string
  amount: number
  currency: string
}

export interface PaymentResponse {
  id: string
  user_id: string
  analysis_id: string | null
  amount: number
  currency: string
  status: string
  mercadopago_payment_id: string | null
  mercadopago_preference_id: string | null
  created_at: string
  updated_at: string
}

export type PackageType = "pack_20" | "pack_50" | "pack_100"

export interface UserCredits {
  free_analyses_count: number
  free_analyses_limit: number
  free_analyses_remaining: number
  paid_analyses_credits: number
  total_analyses_used: number
}

export interface CreditPackage {
  package_type: PackageType
  credits_count: number
  price_usd: number
  is_active: boolean
}

export interface PaymentPreference {
  preference_id: string
  payment_url: string
  amount: number
  currency: string
  package_type: string
}
