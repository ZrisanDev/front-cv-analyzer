import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { TOKEN_KEY, ROUTES } from "@/modules/shared/lib/constants"
import { LandingPage } from "@/modules/landing"

export const metadata = {
  title: "CV Analyzer — Analizá tu CV con Inteligencia Artificial",
  description:
    "Subí tu currículum y recibí un análisis completo en segundos. Identificá fortalezas, áreas de mejora y optimizá tu perfil profesional. 3 análisis gratuitos al registrarte.",
  keywords: [
    "análisis de CV",
    "analizador de currículum",
    "CV analyzer",
    "inteligencia artificial",
    "optimización de CV",
    "revisión de currículum",
    "análisis profesional",
    "mejorar CV",
  ],
  openGraph: {
    title: "CV Analyzer — Analizá tu CV con Inteligencia Artificial",
    description:
      "Subí tu currículum y recibí un análisis completo en segundos. 3 análisis gratuitos al registrarte.",
    type: "website",
    locale: "es_AR",
    siteName: "CV Analyzer",
  },
}

/**
 * Homepage — Server Component.
 *
 * Auth check via cookies (same pattern as app/(main)/layout.tsx):
 * - Authenticated → redirect to /analyze (the app)
 * - Not authenticated → render the LandingPage (SEO-friendly, no FOUC)
 */
export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_KEY)?.value

  if (token) {
    redirect(ROUTES.ANALYZE)
  }

  return <LandingPage />
}
