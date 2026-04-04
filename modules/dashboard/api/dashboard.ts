import { api } from "@/modules/shared/lib/api"
import type { ApiResponse } from "@/modules/shared/types/common"
import type { DashboardStats } from "@/modules/dashboard/types/dashboard"

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<ApiResponse<DashboardStats>>(
    `/api/dashboard/stats`
  )
  return data.data
}
