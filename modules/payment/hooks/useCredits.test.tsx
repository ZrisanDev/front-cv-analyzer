import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

// Mock the API functions
vi.mock("@/modules/payment/api/credits", () => ({
  getCredits: vi.fn(),
  getPackages: vi.fn(),
}))

// Mock useAuth
vi.mock("@/modules/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}))

import { useCreditsBalance, useCreditPackages, CREDIT_KEYS } from "@/modules/payment/hooks/useCredits"
import { getCredits, getPackages } from "@/modules/payment/api/credits"
import { useAuth } from "@/modules/auth/hooks/useAuth"

const mockGetCredits = vi.mocked(getCredits)
const mockGetPackages = vi.mocked(getPackages)
const mockUseAuth = vi.mocked(useAuth)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe("modules/payment/hooks/useCredits", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("CREDIT_KEYS", () => {
    it("has correct structure", () => {
      expect(CREDIT_KEYS.all).toEqual(["credits"])
      expect(CREDIT_KEYS.balance()).toEqual(["credits", "balance"])
      expect(CREDIT_KEYS.packages()).toEqual(["credits", "packages"])
    })
  })

  describe("useCreditsBalance", () => {
    it("does not fetch when not authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      })

      const { result } = renderHook(() => useCreditsBalance(), {
        wrapper: createWrapper(),
      })

      expect(result.current.fetchStatus).toBe("idle")
      expect(mockGetCredits).not.toHaveBeenCalled()
    })

    it("fetches credits when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", name: "Test", email: "test@test.com" },
        token: "token",
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      })
      mockGetCredits.mockResolvedValueOnce({
        free_analyses_count: 2,
        free_analyses_limit: 3,
        free_analyses_remaining: 1,
        paid_analyses_credits: 10,
        total_analyses_used: 2,
      })

      const { result } = renderHook(() => useCreditsBalance(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual({
        free_analyses_count: 2,
        free_analyses_limit: 3,
        free_analyses_remaining: 1,
        paid_analyses_credits: 10,
        total_analyses_used: 2,
      })
    })

    it("uses correct queryKey", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", name: "Test", email: "test@test.com" },
        token: "token",
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      })
      mockGetCredits.mockResolvedValueOnce({
        free_analyses_remaining: 3,
        paid_analyses_credits: 0,
      } as any)

      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
      const spy = vi.spyOn(queryClient, "prefetchQuery")

      function WrapperWithClient({ children }: { children: ReactNode }) {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      }

      renderHook(() => useCreditsBalance(), { wrapper: WrapperWithClient })

      await waitFor(() => {
        // The queryKey should match CREDIT_KEYS.balance()
        const cachedQueries = queryClient.getQueryCache().findAll()
        const creditsQuery = cachedQueries.find(
          (q) => JSON.stringify(q.queryKey) === JSON.stringify(CREDIT_KEYS.balance())
        )
        expect(creditsQuery).toBeDefined()
      })

      spy.mockRestore()
    })
  })

  describe("useCreditPackages", () => {
    it("fetches and returns packages", async () => {
      const mockPackages = [
        { package_type: "pack_20" as const, credits_count: 20, price_usd: 3, is_active: true },
        { package_type: "pack_50" as const, credits_count: 50, price_usd: 10, is_active: true },
        { package_type: "pack_100" as const, credits_count: 100, price_usd: 20, is_active: true },
      ]
      mockGetPackages.mockResolvedValueOnce(mockPackages)

      const { result } = renderHook(() => useCreditPackages(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockPackages)
      expect(result.current.data).toHaveLength(3)
    })
  })
})
