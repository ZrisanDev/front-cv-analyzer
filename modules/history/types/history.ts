export type HistoryStatus = "completed" | "processing" | "failed"

export interface HistoryItem {
  id: string
  status: string
  compatibility_score: number | null
  job_url: string | null
  created_at: string
  updated_at: string
}

export interface HistoryResponse {
  items: HistoryItem[]
  total: number
  page: number
  per_page: number
  pages: number
}

export interface HistoryDetailResponse {
  id: string
  cv_text: string
  job_description: string
  job_url: string | null
  status: string
  compatibility_score: number | null
  analysis_result: object | null
  error_message: string | null
  created_at: string
  updated_at: string
}
