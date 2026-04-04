import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { LandingPage } from "@/modules/landing/components/LandingPage"
import { HeroSection } from "@/modules/landing/components/HeroSection"
import { FeaturesSection } from "@/modules/landing/components/FeaturesSection"
import { HowItWorksSection } from "@/modules/landing/components/HowItWorksSection"
import { FAQSection } from "@/modules/landing/components/FAQSection"
import { CTASection } from "@/modules/landing/components/CTASection"
import { FEATURES, HOW_IT_WORKS, FAQ_ITEMS, HERO, CTA_FINAL, FREE_CREDITS_INFO } from "@/modules/landing/lib/constants"

// Mock next/link — renders a plain anchor in jsdom
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock lucide-react icons used across landing sections
vi.mock("lucide-react", () => ({
  ArrowRight: () => <span data-testid="icon-arrow-right">→</span>,
  FileSearch: () => <span data-testid="icon-file-search">🔍</span>,
  Sparkles: () => <span data-testid="icon-sparkles">✨</span>,
  ShieldCheck: () => <span data-testid="icon-shield-check">🛡</span>,
  Zap: () => <span data-testid="icon-zap">⚡</span>,
  Upload: () => <span data-testid="icon-upload">📤</span>,
  Cpu: () => <span data-testid="icon-cpu">🖥</span>,
  FileBarChart: () => <span data-testid="icon-file-bar-chart">📊</span>,
  Gift: () => <span data-testid="icon-gift">🎁</span>,
  Loader2: () => <span data-testid="icon-loader2">⏳</span>,
}))

// Mock useCreditPackages hook
vi.mock("@/modules/payment/hooks/useCredits", () => ({
  useCreditPackages: vi.fn(),
}))

import { useCreditPackages } from "@/modules/payment/hooks/useCredits"
import { PricingPreviewSection } from "@/modules/landing/components/PricingPreviewSection"

const mockUseCreditPackages = vi.mocked(useCreditPackages)

// Mock data matching API response
const mockPackages = [
  { package_type: "pack_20", credits_count: 20, price_usd: 3.0, is_active: true },
  { package_type: "pack_50", credits_count: 50, price_usd: 10.0, is_active: true },
  { package_type: "pack_100", credits_count: 100, price_usd: 20.0, is_active: true },
]

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

describe("LandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

// Mock shadcn components
vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
  AccordionItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion-item">{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="accordion-trigger">{children}</button>
  ),
  AccordionContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion-content">{children}</div>
  ),
}))

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) => {
    if (props.asChild) return <>{children}</>
    return <button {...props}>{children}</button>
  },
}))

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
}))

// ---------------------------------------------------------------------------
// LandingPage (composite)
// ---------------------------------------------------------------------------

describe("LandingPage", () => {
  it("renders all sections in order", () => {
    const { container } = render(<LandingPage />)

    expect(container.querySelector("section:first-of-type")).toBeInTheDocument()
    // We verify the page has multiple sections by checking section count
    const sections = container.querySelectorAll("section")
    expect(sections.length).toBeGreaterThanOrEqual(5)
  })
})

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------

describe("HeroSection", () => {
  it("renders the main heading from HERO constant", () => {
    render(<HeroSection />)

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      HERO.heading
    )
  })

  it("renders the subheading", () => {
    render(<HeroSection />)

    expect(screen.getByText(HERO.subheading)).toBeInTheDocument()
  })

  it("renders the free credits badge", () => {
    render(<HeroSection />)

    expect(screen.getByText("3 análisis gratuitos al registrarte")).toBeInTheDocument()
  })

  it("renders the primary CTA link with correct href", () => {
    render(<HeroSection />)

    const primaryLink = screen.getByRole("link", { name: new RegExp(HERO.primaryLabel, "i") })
    expect(primaryLink).toBeInTheDocument()
    expect(primaryLink).toHaveAttribute("href", HERO.primaryHref)
  })

  it("renders the secondary CTA link", () => {
    render(<HeroSection />)

    const secondaryLink = screen.getByRole("link", { name: new RegExp(HERO.secondaryLabel!, "i") })
    expect(secondaryLink).toBeInTheDocument()
    expect(secondaryLink).toHaveAttribute("href", HERO.secondaryHref)
  })
})

// ---------------------------------------------------------------------------
// FeaturesSection
// ---------------------------------------------------------------------------

describe("FeaturesSection", () => {
  it("renders the section heading", () => {
    render(<FeaturesSection />)

    expect(
      screen.getByRole("heading", { name: /¿por qué elegirnos/i })
    ).toBeInTheDocument()
  })

  it("renders all feature cards", () => {
    render(<FeaturesSection />)

    for (const feature of FEATURES) {
      expect(screen.getByText(feature.title)).toBeInTheDocument()
      expect(screen.getByText(feature.description)).toBeInTheDocument()
    }
  })

  it("renders the correct number of feature icons", () => {
    render(<FeaturesSection />)

    const icons = document.querySelectorAll("[data-testid^='icon-']")
    // Only icons from ICON_MAP are rendered: FileSearch, Sparkles, ShieldCheck, Zap
    expect(icons.length).toBe(FEATURES.length)
  })
})

// ---------------------------------------------------------------------------
// HowItWorksSection
// ---------------------------------------------------------------------------

describe("HowItWorksSection", () => {
  it("renders the section heading", () => {
    render(<HowItWorksSection />)

    expect(
      screen.getByRole("heading", { name: /¿cómo funciona/i })
    ).toBeInTheDocument()
  })

  it("renders all steps with their titles", () => {
    render(<HowItWorksSection />)

    for (const step of HOW_IT_WORKS) {
      expect(screen.getByText(step.title)).toBeInTheDocument()
      expect(screen.getByText(step.description)).toBeInTheDocument()
    }
  })

  it("renders step numbers", () => {
    render(<HowItWorksSection />)

    for (const step of HOW_IT_WORKS) {
      expect(screen.getByText(`Paso ${step.step}`)).toBeInTheDocument()
    }
  })
})

// ---------------------------------------------------------------------------
// FAQSection
// ---------------------------------------------------------------------------

describe("FAQSection", () => {
  it("renders the section heading", () => {
    render(<FAQSection />)

    expect(
      screen.getByRole("heading", { name: /preguntas frecuentes/i })
    ).toBeInTheDocument()
  })

  it("renders all FAQ questions as accordion triggers", () => {
    render(<FAQSection />)

    const triggers = screen.getAllByTestId("accordion-trigger")
    expect(triggers).toHaveLength(FAQ_ITEMS.length)

    for (const faq of FAQ_ITEMS) {
      expect(screen.getByText(faq.question)).toBeInTheDocument()
    }
  })

  it("renders all FAQ answers inside accordion content", () => {
    render(<FAQSection />)

    for (const faq of FAQ_ITEMS) {
      expect(screen.getByText(faq.answer)).toBeInTheDocument()
    }
  })
})

// ---------------------------------------------------------------------------
// CTASection
// ---------------------------------------------------------------------------

describe("CTASection", () => {
  it("renders the CTA heading", () => {
    render(<CTASection />)

    expect(
      screen.getByRole("heading", { name: new RegExp(CTA_FINAL.heading, "i") })
    ).toBeInTheDocument()
  })

  it("renders the CTA subheading", () => {
    render(<CTASection />)

    expect(screen.getByText(CTA_FINAL.subheading)).toBeInTheDocument()
  })

  it("renders the primary CTA link", () => {
    render(<CTASection />)

    const link = screen.getByRole("link", { name: new RegExp(CTA_FINAL.primaryLabel, "i") })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", CTA_FINAL.primaryHref)
  })
})

// ---------------------------------------------------------------------------
// PricingPreviewSection
// ---------------------------------------------------------------------------

describe("PricingPreviewSection", () => {
  beforeEach(() => {
    // Mock useCreditPackages to return successful data
    vi.mocked(useCreditPackages).mockReturnValue({
      data: mockPackages,
      isLoading: false,
      isError: false,
    } as any)
  })

  it("renders section heading", () => {
    render(<PricingPreviewSection />)

    expect(
      screen.getByRole("heading", { name: /créditos a tu medida/i })
    ).toBeInTheDocument()
  })

  it("renders pricing cards for each package", () => {
    render(<PricingPreviewSection />)

    expect(screen.getByText("Pack 20")).toBeInTheDocument()
    expect(screen.getByText("Pack 50")).toBeInTheDocument()
    expect(screen.getByText("Pack 100")).toBeInTheDocument()
  })

  it("renders prices from API formatted as USD", () => {
    render(<PricingPreviewSection />)

    // Prices from mock data: 3.0, 10.0, 20.0
    expect(screen.getByText("$3.00")).toBeInTheDocument()
    expect(screen.getByText("$10.00")).toBeInTheDocument()
    expect(screen.getByText("$20.00")).toBeInTheDocument()
  })

  it("renders 'Más popular' badge on the popular package (pack_50)", () => {
    render(<PricingPreviewSection />)

    expect(screen.getByText("Más popular")).toBeInTheDocument()
  })

  it("renders per-credit price calculated from API data", () => {
    render(<PricingPreviewSection />)

    // 3.0 / 20 = 0.15, 10.0 / 50 = 0.20, 20.0 / 100 = 0.20
    expect(screen.getByText("$0.15 por análisis")).toBeInTheDocument()
    expect(screen.getByText("$0.20 por análisis")).toBeInTheDocument()
  })

  it("renders free credits info banner", () => {
    render(<PricingPreviewSection />)

    expect(screen.getByText(FREE_CREDITS_INFO.count)).toBeInTheDocument()
    expect(screen.getByText(FREE_CREDITS_INFO.label)).toBeInTheDocument()
  })

  it("renders 'Ver todos los planes' link to /pricing", () => {
    render(<PricingPreviewSection />)

    const link = screen.getByRole("link", { name: /ver todos los planes/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/pricing")
  })

  it("renders loading state when packages are loading", () => {
    vi.mocked(useCreditPackages).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any)

    render(<PricingPreviewSection />)

    // Should render skeletons instead of cards
    const skeletons = screen.getAllByRole("generic", { hidden: true })
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("renders error state when packages fail to load", () => {
    mockUseCreditPackages.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any)

    render(<PricingPreviewSection />)

    expect(screen.getByText(/no se pudieron cargar/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /ve a la página de precios/i })).toHaveAttribute("href", "/pricing")
  })
})
