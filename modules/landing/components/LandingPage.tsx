import { HeroSection } from "./HeroSection"
import { FeaturesSection } from "./FeaturesSection"
import { HowItWorksSection } from "./HowItWorksSection"
import { PricingPreviewSection } from "./PricingPreviewSection"
import { FAQSection } from "./FAQSection"
import { CTASection } from "./CTASection"

export function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingPreviewSection />
      <FAQSection />
      <CTASection />
    </main>
  )
}
