// ---------------------------------------------------------------------------
// Landing Page — Types & Interfaces
// ---------------------------------------------------------------------------

/** Data for each feature card in the FeaturesSection grid */
export interface FeatureItem {
  /** Lucide icon name — resolved at render time via dynamic import or icon map */
  icon: string
  title: string
  description: string
}

/** Data for each step in the HowItWorksSection */
export interface HowItWorksStep {
  step: number
  title: string
  description: string
}

/** Single FAQ entry rendered inside an Accordion item */
export interface FAQItem {
  question: string
  answer: string
}

/** CTA block configuration (reused by Hero and CTA sections) */
export interface CTAData {
  heading: string
  subheading: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}
