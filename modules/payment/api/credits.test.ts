import { describe, it, expect, vi, beforeEach } from "vitest"
import { api } from "@/modules/shared/lib/api"

// Mock the api module
vi.mock("@/modules/shared/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

// Import after mock setup
import {
  getCredits,
  getPackages,
  createPackagePreference,
  getPaymentDetails,
} from "@/modules/payment/api/credits"

const mockApi = vi.mocked(api)

describe("modules/payment/api/credits", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getCredits", () => {
    it("calls GET /api/payments/my-credits and returns UserCredits data", async () => {
      const mockCredits = {
        free_analyses_count: 3,
        free_analyses_limit: 3,
        free_analyses_remaining: 0,
        paid_analyses_credits: 50,
        total_analyses_used: 3,
      }
      mockApi.get.mockResolvedValueOnce({
        data: { data: mockCredits, message: "ok", success: true },
      })

      const result = await getCredits()

      expect(mockApi.get).toHaveBeenCalledWith("/api/payments/my-credits")
      expect(result).toEqual(mockCredits)
    })
  })

  describe("getPackages", () => {
    it("calls GET /api/payments/credit-packages and returns CreditPackage[]", async () => {
      const mockPackages = [
        { package_type: "pack_20" as const, credits_count: 20, price_usd: 3, is_active: true },
        { package_type: "pack_50" as const, credits_count: 50, price_usd: 10, is_active: true },
        { package_type: "pack_100" as const, credits_count: 100, price_usd: 20, is_active: true },
      ]
      mockApi.get.mockResolvedValueOnce({
        data: { data: mockPackages, message: "ok", success: true },
      })

      const result = await getPackages()

      expect(mockApi.get).toHaveBeenCalledWith("/api/payments/credit-packages")
      expect(result).toEqual(mockPackages)
      expect(result).toHaveLength(3)
    })
  })

  describe("createPackagePreference", () => {
    it("calls POST /api/payments/create-package-preference with package_type in body", async () => {
      const mockPreference = {
        preference_id: "123456789",
        payment_url: "https://www.mercadopago.com.ar/checkout/v1/...",
        amount: 10.0,
        currency: "USD",
        package_type: "pack_50",
      }
      mockApi.post.mockResolvedValueOnce({
        data: { data: mockPreference, message: "ok", success: true },
      })

      const result = await createPackagePreference("pack_50")

      expect(mockApi.post).toHaveBeenCalledWith(
        "/api/payments/create-package-preference",
        { package_type: "pack_50" }
      )
      expect(result).toEqual(mockPreference)
    })
  })

  describe("getPaymentDetails", () => {
    it("calls GET /api/payments/{paymentId} and returns PaymentPreference", async () => {
      const mockDetails = {
        preference_id: "pref-123",
        payment_url: "https://example.com/pay",
        amount: 10.0,
        currency: "USD",
        package_type: "pack_50",
      }
      mockApi.get.mockResolvedValueOnce({
        data: { data: mockDetails, message: "ok", success: true },
      })

      const result = await getPaymentDetails("pay-abc")

      expect(mockApi.get).toHaveBeenCalledWith("/api/payments/pay-abc")
      expect(result).toEqual(mockDetails)
    })
  })
})
