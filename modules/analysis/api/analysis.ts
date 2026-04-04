import { api } from "@/modules/shared/lib/api"
import type { ApiResponse } from "@/modules/shared/types/common"
import type { PriceInfo, PaymentInitiationResponse, AnalysisPayload, AnalysisSubmitPayload, AnalysisSubmitResponse, AnalysisStatusResponse } from "@/modules/analysis/types/analysis"

export async function getPrice(): Promise<PriceInfo> {
  const { data } = await api.get<ApiResponse<PriceInfo>>("/api/analysis/price")
  return data.data
}

export async function initiatePayment(payload: AnalysisPayload): Promise<PaymentInitiationResponse> {
  const formData = new FormData()
  formData.append("cv", payload.cv)

  if (payload.jobDescription) {
    formData.append("job_description", payload.jobDescription)
  }

  if (payload.jobUrl) {
    formData.append("job_url", payload.jobUrl)
  }

  const { data } = await api.post<ApiResponse<PaymentInitiationResponse>>(
    "/api/analysis/pay",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return data.data
}

export async function submitAnalysis(
  payload: AnalysisSubmitPayload,
): Promise<AnalysisSubmitResponse> {
  const formData = new FormData()
  formData.append("file", payload.file)

  if (payload.job_text) {
    formData.append("job_text", payload.job_text)
  }

  if (payload.job_url) {
    formData.append("job_url", payload.job_url)
  }

  const { data } = await api.post<AnalysisSubmitResponse>(
    "/api/analysis/submit",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  return data
}

export async function getAnalysisStatus(
  analysisId: string,
): Promise<AnalysisStatusResponse> {
  const { data } = await api.get<AnalysisStatusResponse>(
    `/api/analysis/${analysisId}/status`,
  )

  return data
}
