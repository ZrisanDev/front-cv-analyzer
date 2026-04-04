import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"

// Mock useCreditsBalance — the only dependency of useCreditFlow
vi.mock("@/modules/payment/hooks/useCredits", () => ({
  useCreditsBalance: vi.fn(),
}))

import { useCreditFlow } from "@/modules/payment/hooks/useCreditFlow"
import { useCreditsBalance } from "@/modules/payment/hooks/useCredits"

const mockUseCreditsBalance = vi.mocked(useCreditsBalance)

/** Helper: mock useCreditsBalance return — only fields used by useCreditFlow */
function mockCredits(data: {
  free_analyses_remaining: number
  paid_analyses_credits: number
} | undefined = undefined) {
  mockUseCreditsBalance.mockReturnValue({
    data,
    isLoading: data === undefined,
    isError: false,
    refetch: vi.fn().mockResolvedValue({ data }),
    // UseQueryResult has 20+ more fields, but useCreditFlow only uses the above
  } as any)
}

describe("modules/payment/hooks/useCreditFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("totalCredits", () => {
    it("returns 0 when credits data is undefined (loading)", () => {
      mockCredits(undefined)

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.totalCredits).toBe(0)
    })

    it("returns sum of free + paid credits", () => {
      mockCredits({ free_analyses_remaining: 2, paid_analyses_credits: 50 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.totalCredits).toBe(52)
    })

    it("returns only free credits when no paid credits", () => {
      mockCredits({ free_analyses_remaining: 3, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.totalCredits).toBe(3)
    })

    it("returns only paid credits when no free remaining", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 20 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.totalCredits).toBe(20)
    })

    it("returns 0 when both are 0", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.totalCredits).toBe(0)
    })
  })

  describe("hasCredits", () => {
    it("returns false when credits data is undefined", () => {
      mockCredits(undefined)

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.hasCredits).toBe(false)
    })

    it("returns true when total credits > 0", () => {
      mockCredits({ free_analyses_remaining: 1, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.hasCredits).toBe(true)
    })

    it("returns false when total credits is 0", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.hasCredits).toBe(false)
    })
  })

  describe("showUpsell", () => {
    it("returns false while loading (credits undefined)", () => {
      mockCredits(undefined)

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.showUpsell).toBe(false)
    })

    it("returns true when credits = 0, not dismissed, not loading, no error", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.showUpsell).toBe(true)
    })

    it("returns false when user has credits", () => {
      mockCredits({ free_analyses_remaining: 3, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.showUpsell).toBe(false)
    })

    it("returns false when there is an error", () => {
      mockUseCreditsBalance.mockReturnValue({
        data: { free_analyses_remaining: 0, paid_analyses_credits: 0 },
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      } as any)

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.showUpsell).toBe(false)
    })

    it("returns false while still loading even with 0 credits data present", () => {
      mockUseCreditsBalance.mockReturnValue({
        data: { free_analyses_remaining: 0, paid_analyses_credits: 0 },
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      } as any)

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.showUpsell).toBe(false)
    })
  })

  describe("dismissUpsell", () => {
    it("sets showUpsell to false when called", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.showUpsell).toBe(true)

      act(() => {
        result.current.dismissUpsell()
      })

      expect(result.current.showUpsell).toBe(false)
    })

    it("keeps hasCredits unchanged after dismiss", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 0 })

      const { result } = renderHook(() => useCreditFlow())

      act(() => {
        result.current.dismissUpsell()
      })

      expect(result.current.hasCredits).toBe(false)
    })
  })

  describe("refreshCredits", () => {
    it("resets dismissed state so showUpsell returns true again", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 0 })
      const refetch = vi.fn().mockResolvedValue({ data: { free_analyses_remaining: 0, paid_analyses_credits: 0 } })
      mockUseCreditsBalance.mockReturnValue({
        data: { free_analyses_remaining: 0, paid_analyses_credits: 0 },
        isLoading: false,
        isError: false,
        refetch,
      } as any)

      const { result } = renderHook(() => useCreditFlow())

      // Dismiss the upsell
      act(() => {
        result.current.dismissUpsell()
      })
      expect(result.current.showUpsell).toBe(false)

      // Refresh credits — resets dismissed
      act(() => {
        result.current.refreshCredits()
      })
      expect(result.current.showUpsell).toBe(true)
    })

    it("calls refetch from useCreditsBalance", () => {
      mockCredits({ free_analyses_remaining: 0, paid_analyses_credits: 0 })
      const refetch = vi.fn().mockResolvedValue({})
      mockUseCreditsBalance.mockReturnValue({
        data: { free_analyses_remaining: 0, paid_analyses_credits: 0 },
        isLoading: false,
        isError: false,
        refetch,
      } as any)

      const { result } = renderHook(() => useCreditFlow())

      act(() => {
        result.current.refreshCredits()
      })

      expect(refetch).toHaveBeenCalledTimes(1)
    })
  })

  describe("isLoading and isError", () => {
    it("passes through isLoading from useCreditsBalance", () => {
      mockCredits(undefined) // isLoading: true by default in mockCredits

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.isLoading).toBe(true)
    })

    it("passes through isError from useCreditsBalance", () => {
      mockUseCreditsBalance.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      } as any)

      const { result } = renderHook(() => useCreditFlow())

      expect(result.current.isError).toBe(true)
    })
  })
})
