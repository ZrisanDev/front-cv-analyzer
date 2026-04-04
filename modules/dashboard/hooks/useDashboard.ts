import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "@/modules/dashboard/api/dashboard"

const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_KEYS.all, "stats"] as const,
} as const

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats(),
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000,
  })
}
