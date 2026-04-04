import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PricingCard } from "@/modules/payment/components/PricingCard"
import type { CreditPackage } from "@/modules/payment/types/payment"

const mockPackage: CreditPackage = {
  package_type: "pack_50",
  credits_count: 50,
  price_usd: 10,
  is_active: true,
}

describe("PricingCard", () => {
  it("renders package name, price, and credits count", () => {
    render(<PricingCard pkg={mockPackage} onSelect={vi.fn()} />)

    expect(screen.getByText("Pack 50")).toBeInTheDocument()
    expect(screen.getByText("$10.00")).toBeInTheDocument()
    expect(screen.getByText("USD")).toBeInTheDocument()
    expect(screen.getByText("50 análisis de CV")).toBeInTheDocument()
  })

  it("renders price per credit", () => {
    render(<PricingCard pkg={mockPackage} onSelect={vi.fn()} />)

    expect(screen.getByText("$0.20 por análisis")).toBeInTheDocument()
  })

  it("renders feature list items", () => {
    render(<PricingCard pkg={mockPackage} onSelect={vi.fn()} />)

    expect(screen.getByText("Sin fecha de expiración")).toBeInTheDocument()
    expect(screen.getByText("Acceso inmediato")).toBeInTheDocument()
  })

  it("calls onSelect with correct packageType on button click", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<PricingCard pkg={mockPackage} onSelect={onSelect} />)

    await user.click(screen.getByRole("button", { name: /comprar ahora/i }))

    expect(onSelect).toHaveBeenCalledWith("pack_50")
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it("shows popular badge when isPopular is true", () => {
    render(<PricingCard pkg={mockPackage} isPopular onSelect={vi.fn()} />)

    expect(screen.getByText("Más popular")).toBeInTheDocument()
  })

  it("does not show popular badge when isPopular is false", () => {
    render(<PricingCard pkg={mockPackage} isPopular={false} onSelect={vi.fn()} />)

    expect(screen.queryByText("Más popular")).not.toBeInTheDocument()
  })
})
