import { api } from "@/modules/shared/lib/api"
import type { HistoryResponse } from "@/modules/history/types/history"

export async function getHistory(
  page = 1,
  perPage = 10
): Promise<HistoryResponse> {
  const { data } = await api.get<HistoryResponse>(
    `/api/history`,
    { params: { page, per_page: perPage } }
  )
  return data
}

export async function deleteAnalysis(id: string): Promise<void> {
  await api.delete(`/api/analysis/${id}`)
}
