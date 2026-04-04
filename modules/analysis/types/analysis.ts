export interface AnalysisPayload {
  cv: File
  jobDescription?: string
  jobUrl?: string
}

export interface PriceInfo {
  amount: number
  currency: string
}

export interface PaymentInitiationResponse {
  paymentUrl: string
  paymentId: string
}

export interface AnalysisPayloadFormData {
  cv: File
  job_description?: string
  job_url?: string
}

export interface AnalysisSubmitPayload {
  file: File
  job_text?: string | null
  job_url?: string | null
}

export interface AnalysisSubmitResponse {
  id: string
  status: string
  message: string
}

export interface AnalysisStatusResponse {
  id: string
  status: string
  compatibility_score: number | null
  analysis_result: object | null
  error_message: string | null
  created_at: string
  updated_at: string
}
