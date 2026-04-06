import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { UserCredits } from "@/modules/payment/types/payment"

// --- Mock data factories ---
const healthyData: UserCredits = {
  free_analyses_count: 2,
  free_analyses_limit: 5,
  free_analyses_remaining: 3,
  paid_analyses_credits: 10,
  total_analyses_used: 7,
}

const warningData: UserCredits = {
  free_analyses_count: 3,
  free_analyses_limit: 5,
  free_analyses_remaining: 2,
  paid_analyses_credits: 0,
  total_analyses_used: 12,
}

const dangerData: UserCredits = {
  free_analyses_count: 5,
  free_analyses_limit: 5,
  free_analyses_remaining: 0,
  paid_analyses_credits: 0,
  total_analyses_used: 5,
}

const ctaData: UserCredits = {
  free_analyses_count: 4,
  free_analyses_limit: 5,
  free_analyses_remaining: 1,
  paid_analyses_credits: 0,
  total_analyses_used: 4,
}

const zeroLimitData: UserCredits = {
  free_analyses_count: 0,
  free_analyses_limit: 0,
  free_analyses_remaining: 0,
  paid_analyses_credits: 5,
  total_analyses_used: 0,
}

const overUseData: UserCredits = {
  free_analyses_count: 10,
  free_analyses_limit: 5,
  free_analyses_remaining: 0,
  paid_analyses_credits: 3,
  total_analyses_used: 10,
}

// --- Mutable mock state ---
const mockRefetch = vi.fn()

type HookState = {
  data: UserCredits | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
}

let hookState: HookState = {
  data: undefined,
  isLoading: false,
  isError: false,
  error: null,
}

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock the hook — reads from mutable hookState
vi.mock("@/modules/payment/hooks/useCredits", () => ({
  useCreditsBalance: () => ({
    ...hookState,
    refetch: mockRefetch,
  }),
}))

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Coins: () => <span data-testid="icon-coins">Coins</span>,
  AlertCircle: () => <span data-testid="icon-alert">AlertCircle</span>,
  TrendingUp: () => <span data-testid="icon-trending">TrendingUp</span>,
  RefreshCw: () => <span data-testid="icon-refresh">RefreshCw</span>,
}))

// Import after mocks
import { CreditOverviewCard } from "@/modules/payment/components/CreditOverviewCard"

describe("CreditOverviewCard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset to default state
    hookState = {
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    }
  })

  describe("Scenario 4: Loading State", () => {
    it("renders skeleton when loading", () => {
      hookState.isLoading = true

      render(<CreditOverviewCard />)

      // Should show skeleton elements, not actual data
      expect(screen.getAllByTestId("skeleton-placeholder").length).toBeGreaterThan(0)
      // Should NOT show any credit numbers
      expect(screen.queryByText("3")).not.toBeInTheDocument()
      expect(screen.queryByText("10")).not.toBeInTheDocument()
    })
  })

  describe("Scenario 5: Error State", () => {
    it("shows error state with retry button", () => {
      hookState.isError = true
      hookState.error = new Error("Network error")

      render(<CreditOverviewCard />)

      expect(screen.getByRole("alert")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /reintentar/i })).toBeInTheDocument()
    })

    it("calls refetch when retry button is clicked", async () => {
      const user = userEvent.setup()
      hookState.isError = true
      hookState.error = new Error("Network error")

      render(<CreditOverviewCard />)

      await user.click(screen.getByRole("button", { name: /reintentar/i }))

      expect(mockRefetch).toHaveBeenCalledTimes(1)
    })
  })

  describe("Scenario 1: Happy Path (Healthy credits)", () => {
    it("renders happy path with healthy credits", () => {
      hookState.data = healthyData

      render(<CreditOverviewCard />)

      // Card title
      expect(screen.getByText("Créditos")).toBeInTheDocument()
      // Free credits remaining
      expect(screen.getByText("Gratuitos")).toBeInTheDocument()
      expect(screen.getByText("3")).toBeInTheDocument()
      // Paid credits
      expect(screen.getByText("Pagos")).toBeInTheDocument()
      expect(screen.getByText("10")).toBeInTheDocument()
      // Total analyses
      expect(screen.getByText("7")).toBeInTheDocument()
    })

    it("does NOT show CTA when free_analyses_remaining > 1", () => {
      hookState.data = healthyData

      render(<CreditOverviewCard />)

      expect(screen.queryByText(/comprar más/i)).not.toBeInTheDocument()
    })
  })

  describe("Scenario 2: Warning State", () => {
    it("shows warning state when remaining ≤ 2", () => {
      hookState.data = warningData

      render(<CreditOverviewCard />)

      // Should still render credit info
      expect(screen.getByText("2")).toBeInTheDocument()
      expect(screen.getByText("0")).toBeInTheDocument()
      // Progress bar should exist
      expect(screen.getByRole("progressbar")).toBeInTheDocument()
      // CTA only shows when remaining <= 1, not for 2
      expect(screen.queryByText(/comprar más/i)).not.toBeInTheDocument()
    })

    it("shows CTA when remaining = 1", () => {
      hookState.data = ctaData

      render(<CreditOverviewCard />)

      expect(screen.getByText(/comprar más/i)).toBeInTheDocument()
      const link = screen.getByRole("link", { name: /comprar más/i })
      expect(link).toHaveAttribute("href", "/pricing")
    })
  })

  describe("Scenario 3: Danger State", () => {
    it("shows danger state when remaining = 0", () => {
      hookState.data = dangerData

      render(<CreditOverviewCard />)

      // Should render data — use labels to avoid ambiguity of "0"
      expect(screen.getByText("Gratuitos")).toBeInTheDocument()
      expect(screen.getByText("Pagos")).toBeInTheDocument()
      expect(screen.getByText("5")).toBeInTheDocument()
      // Progress bar should exist
      expect(screen.getByRole("progressbar")).toBeInTheDocument()
      // Progress text shows 0 remaining
      expect(screen.getByText(/0 de 5 análisis gratuitos restantes/)).toBeInTheDocument()
    })

    it("shows CTA when remaining = 0 and no paid credits", () => {
      hookState.data = dangerData

      render(<CreditOverviewCard />)

      expect(screen.getByText(/comprar más/i)).toBeInTheDocument()
      const link = screen.getByRole("link", { name: /comprar más/i })
      expect(link).toHaveAttribute("href", "/pricing")
    })
  })

  describe("Edge Cases", () => {
    it("handles division by zero when limit = 0", () => {
      hookState.data = zeroLimitData

      render(<CreditOverviewCard />)

      // Should not crash, should render with 0% progress
      const progressbar = screen.getByRole("progressbar")
      expect(progressbar).toBeInTheDocument()
      expect(progressbar).toHaveAttribute("aria-valuenow", "0")
      // Should still show paid credits
      expect(screen.getByText("5")).toBeInTheDocument()
    })

    it("handles over-use when count > limit (clamps to 100%)", () => {
      hookState.data = overUseData

      render(<CreditOverviewCard />)

      const progressbar = screen.getByRole("progressbar")
      expect(progressbar).toBeInTheDocument()
      // count=10, limit=5 → 200% → clamped to 100
      expect(progressbar).toHaveAttribute("aria-valuenow", "100")
    })
  })

  describe("Accessibility", () => {
    it("has correct ARIA attributes on progress bar", () => {
      hookState.data = healthyData

      render(<CreditOverviewCard />)

      const progressbar = screen.getByRole("progressbar", { name: /créditos gratuitos consumidos/i })
      expect(progressbar).toBeInTheDocument()
      expect(progressbar).toHaveAttribute("aria-valuenow", "40") // 2/5 = 40%
      expect(progressbar).toHaveAttribute("aria-valuemin", "0")
      expect(progressbar).toHaveAttribute("aria-valuemax", "100")
    })

    it("has accessible labels on interactive elements", () => {
      hookState.data = ctaData

      render(<CreditOverviewCard />)

      // CTA link should have descriptive text
      const ctaLink = screen.getByRole("link", { name: /comprar más/i })
      expect(ctaLink).toBeInTheDocument()
    })
  })

  describe("CTA Button", () => {
    it("shows CTA button when free_analyses_remaining <= 1", () => {
      // remaining = 1, no paid → show CTA
      hookState.data = ctaData
      const { unmount } = render(<CreditOverviewCard />)
      expect(screen.getByRole("link", { name: /comprar más/i })).toBeInTheDocument()
      unmount()

      // remaining = 0, no paid → show CTA
      hookState.data = dangerData
      render(<CreditOverviewCard />)
      expect(screen.getByRole("link", { name: /comprar más/i })).toBeInTheDocument()
    })

    it("navigates to /pricing when CTA is clicked", () => {
      hookState.data = ctaData

      render(<CreditOverviewCard />)

      const link = screen.getByRole("link", { name: /comprar más/i })
      expect(link).toHaveAttribute("href", "/pricing")
    })

    it("shows CTA even when user has paid credits but free remaining <= 1", () => {
      // remaining=0, but has paid credits → still show CTA per spec FR-003.1
      hookState.data = overUseData

      render(<CreditOverviewCard />)

      expect(screen.getByRole("link", { name: /comprar más/i })).toBeInTheDocument()
    })
  })
})
