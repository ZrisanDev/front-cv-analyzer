import { useState, useMemo, useCallback } from "react"
import { useCreditsBalance } from "./useCredits"

export interface UseCreditFlowReturn {
  /** Whether the user has credits available (free + paid) */
  hasCredits: boolean
  /** Total credits available (free_analyses_remaining + paid_analyses_credits) */
  totalCredits: number
  /** Whether to show the upsell modal (no credits && not dismissed && not loading) */
  showUpsell: boolean
  /** Dismiss the upsell modal */
  dismissUpsell: () => void
  /** Whether the credits data is still loading */
  isLoading: boolean
  /** Whether there was an error fetching credits */
  isError: boolean
  /** Force refetch credits from the API */
  refreshCredits: () => void
}

export function useCreditFlow(): UseCreditFlowReturn {
  const [dismissed, setDismissed] = useState(false)

  const {
    data: credits,
    isLoading,
    isError,
    refetch,
  } = useCreditsBalance()

  const totalCredits = useMemo(() => {
    if (!credits) return 0
    return credits.free_analyses_remaining + credits.paid_analyses_credits
  }, [credits])

  const hasCredits = useMemo(() => totalCredits > 0, [totalCredits])

  const showUpsell = useMemo(() => {
    if (isLoading) return false
    if (isError) return false
    if (credits === undefined) return false
    if (dismissed) return false
    return totalCredits === 0
  }, [credits, totalCredits, dismissed, isLoading, isError])

  const dismissUpsell = useCallback(() => {
    setDismissed(true)
  }, [])

  const refreshCredits = useCallback(() => {
    setDismissed(false)
    refetch()
  }, [refetch])

  return {
    hasCredits,
    totalCredits,
    showUpsell,
    dismissUpsell,
    isLoading,
    isError,
    refreshCredits,
  }
}
