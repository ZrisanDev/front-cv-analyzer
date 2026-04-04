import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CreditBadge } from "@/modules/payment/components/CreditBadge"

describe("CreditBadge", () => {
  it("renders 0 credits with muted state when both are zero", () => {
    render(<CreditBadge freeRemaining={0} paidCredits={0} />)

    expect(screen.getByText("0 créditos")).toBeInTheDocument()
  })

  it("renders singular 'crédito disponible' when total is 1", () => {
    render(<CreditBadge freeRemaining={1} paidCredits={0} />)

    expect(screen.getByText("1 crédito disponible")).toBeInTheDocument()
    expect(screen.getByText("(1 gratis + 0 pagos)")).toBeInTheDocument()
  })

  it("renders plural 'créditos disponibles' when total > 1", () => {
    render(<CreditBadge freeRemaining={3} paidCredits={0} />)

    expect(screen.getByText("3 créditos disponibles")).toBeInTheDocument()
    expect(screen.getByText("(3 gratis + 0 pagos)")).toBeInTheDocument()
  })

  it("renders only paid credits when no free remaining", () => {
    render(<CreditBadge freeRemaining={0} paidCredits={50} />)

    expect(screen.getByText("50 créditos disponibles")).toBeInTheDocument()
    expect(screen.getByText("(0 gratis + 50 pagos)")).toBeInTheDocument()
  })

  it("renders combined total correctly", () => {
    render(<CreditBadge freeRemaining={3} paidCredits={50} />)

    expect(screen.getByText("53 créditos disponibles")).toBeInTheDocument()
    expect(screen.getByText("(3 gratis + 50 pagos)")).toBeInTheDocument()
  })
})
