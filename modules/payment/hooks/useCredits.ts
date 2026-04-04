import { useQuery } from "@tanstack/react-query"
import { getCredits as getCreditsApi, getPackages as getPackagesApi } from "@/modules/payment/api/credits"
import { useAuth } from "@/modules/auth/hooks/useAuth"

const CREDIT_KEYS = {
  all: ["credits"] as const,
  balance: () => [...CREDIT_KEYS.all, "balance"] as const,
  packages: () => [...CREDIT_KEYS.all, "packages"] as const,
}

const FIVE_MINUTES_MS = 5 * 60 * 1000

export function useCreditsBalance() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: CREDIT_KEYS.balance(),
    queryFn: getCreditsApi,
    enabled: isAuthenticated,
    staleTime: FIVE_MINUTES_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export function useCreditPackages() {
  return useQuery({
    queryKey: CREDIT_KEYS.packages(),
    queryFn: getPackagesApi,
    retry: 2,
    placeholderData: [],
  })
}

export { CREDIT_KEYS }
