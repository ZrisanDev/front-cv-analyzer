import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

// Mock the API functions
vi.mock("@/modules/payment/api/credits", () => ({
  getPackages: vi.fn(),
  createPackagePreference: vi.fn(),
}))

import { getPackages, createPackagePreference } from "@/modules/payment/api/credits"
import { PricingPageContent } from "@/app/pricing/PricingPageContent"

const mockGetPackages = vi.mocked(getPackages)
const mockCreatePackagePreference = vi.mocked(createPackagePreference)

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

const mockPackages = [
  { package_type: "pack_20" as const, credits_count: 20, price_usd: 3, is_active: true },
  { package_type: "pack_50" as const, credits_count: 50, price_usd: 10, is_active: true },
  { package_type: "pack_100" as const, credits_count: 100, price_usd: 20, is_active: true },
]

describe("PricingPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.href setter
    delete (window as any).location
    window.location = { href: "" } as any
  })

  it("renders all packages in the grid", async () => {
    mockGetPackages.mockResolvedValueOnce(mockPackages)

    render(<PricingPageContent />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Pack 20")).toBeInTheDocument()
      expect(screen.getByText("Pack 50")).toBeInTheDocument()
      expect(screen.getByText("Pack 100")).toBeInTheDocument()
    })
  })

  it("renders pack 50 as popular", async () => {
    mockGetPackages.mockResolvedValueOnce(mockPackages)

    render(<PricingPageContent />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText("Más popular")).toBeInTheDocument()
    })
  })

  it("calls createPackagePreference and redirects on purchase click", async () => {
    const user = userEvent.setup()
    mockGetPackages.mockResolvedValueOnce(mockPackages)
    mockCreatePackagePreference.mockResolvedValueOnce({
      preference_id: "pref-123",
      payment_url: "https://mercadopago.com/checkout/pay",
      amount: 10,
      currency: "USD",
      package_type: "pack_50",
    })

    render(<PricingPageContent />, { wrapper: createWrapper() })

    // Wait for packages to load and click buy on pack 50
    await waitFor(() => {
      expect(screen.getByText("Pack 50")).toBeInTheDocument()
    })

    // Find all "Comprar ahora" buttons - third one should be pack_50
    const buttons = screen.getAllByRole("button", { name: /comprar ahora/i })
    expect(buttons).toHaveLength(3)

    await user.click(buttons[1]) // pack_50 is the second one

    await waitFor(() => {
      expect(mockCreatePackagePreference).toHaveBeenCalledWith("pack_50")
    })

    expect(window.location.href).toBe("https://mercadopago.com/checkout/pay")
  })

  it("shows error state when packages fail to load", async () => {
    mockGetPackages.mockRejectedValueOnce(new Error("Network error"))

    render(<PricingPageContent />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(
        screen.getByText(/no se pudieron cargar los paquetes/i)
      ).toBeInTheDocument()
    })
  })
})
