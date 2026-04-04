import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CreditUpsellModal } from "@/modules/payment/components/CreditUpsellModal"

// Mock next/link — just renders an anchor in test env
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock shadcn Dialog — avoids radix portal/overlay issues in jsdom
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="dialog-root">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}))

// Mock lucide-react to render simple spans
vi.mock("lucide-react", () => ({
  Coins: () => <span data-testid="icon-coins">Coins</span>,
}))

describe("CreditUpsellModal", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onDismiss: vi.fn(),
  }

  it("does not render when open is false", () => {
    render(<CreditUpsellModal {...defaultProps} open={false} />)

    expect(screen.queryByTestId("dialog-root")).not.toBeInTheDocument()
  })

  it("renders the dialog when open is true", () => {
    render(<CreditUpsellModal {...defaultProps} />)

    expect(screen.getByTestId("dialog-root")).toBeInTheDocument()
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument()
  })

  it("renders the title about credits running out", () => {
    render(<CreditUpsellModal {...defaultProps} />)

    expect(
      screen.getByRole("heading", { name: /se te acabaron tus créditos/i })
    ).toBeInTheDocument()
  })

  it("renders the description explaining the next step", () => {
    render(<CreditUpsellModal {...defaultProps} />)

    expect(
      screen.getByText(/agotaste tus análisis disponibles/i)
    ).toBeInTheDocument()
  })

  it("renders the Coins icon", () => {
    render(<CreditUpsellModal {...defaultProps} />)

    expect(screen.getByTestId("icon-coins")).toBeInTheDocument()
  })

  it("renders 'Ver planes' link pointing to /pricing", () => {
    render(<CreditUpsellModal {...defaultProps} />)

    const link = screen.getByRole("link", { name: /ver planes/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/pricing")
  })

  it("renders 'Cerrar' button", () => {
    render(<CreditUpsellModal {...defaultProps} />)

    expect(
      screen.getByRole("button", { name: /cerrar/i })
    ).toBeInTheDocument()
  })

  it("calls onDismiss when 'Cerrar' button is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<CreditUpsellModal {...defaultProps} onDismiss={onDismiss} />)

    await user.click(screen.getByRole("button", { name: /cerrar/i }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
