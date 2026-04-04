import { ROUTES } from "@/modules/shared/lib/constants"
import type { FeatureItem, HowItWorksStep, FAQItem, CTAData } from "../types/landing"

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const HERO: CTAData = {
  heading: "Analiza tu CV con Inteligencia Artificial",
  subheading:
    "Subí tu currículum y recibí un análisis completo en segundos. Identificá fortalezas, áreas de mejora y optimizá tu perfil profesional para destacar.",
  primaryLabel: "Comenzar gratis",
  primaryHref: ROUTES.REGISTER,
  secondaryLabel: "Ya tengo cuenta",
  secondaryHref: ROUTES.LOGIN,
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

export const FEATURES: FeatureItem[] = [
  {
    icon: "FileSearch",
    title: "Análisis profundo",
    description:
      "Evaluamos estructura, contenido, palabras clave y alineación con mejores prácticas del mercado laboral.",
  },
  {
    icon: "Sparkles",
    title: "IA de última generación",
    description:
      "Motor de inteligencia artificial entrenado específicamente para CVs del mercado hispanohablante.",
  },
  {
    icon: "ShieldCheck",
    title: "Privacidad garantizada",
    description:
      "Tu CV nunca se comparte con terceros. Eliminamos los archivos después del análisis.",
  },
  {
    icon: "Zap",
    title: "Resultados instantáneos",
    description:
      "Recibí un reporte detallado con puntuaciones y sugerencias accionables en segundos.",
  },
]

// ---------------------------------------------------------------------------
// How It Works
// ---------------------------------------------------------------------------

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Subí tu CV",
    description: "Arrastrá tu archivo PDF o seleccionalo desde tu dispositivo. Es rápido y seguro.",
  },
  {
    step: 2,
    title: "Análisis automático",
    description:
      "Nuestra IA evalúa tu currículum en múltiples dimensiones: formato, contenido y impacto.",
  },
  {
    step: 3,
    title: "Recibí tus resultados",
    description:
      "Obtené un reporte con puntuaciones, sugerencias concretas y recomendaciones personalizadas.",
  },
]

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "¿Cuántos análisis gratis tengo?",
    answer:
      "Tenés 3 análisis gratuitos al registrarte. Una vez agotados, podés comprar paquetes de créditos para seguir utilizando la plataforma.",
  },
  {
    question: "¿Qué formatos de archivo aceptan?",
    answer:
      "Actualmente aceptamos archivos PDF. Asegurate de que el CV no esté protegido con contraseña.",
  },
  {
    question: "¿Los créditos vencen?",
    answer:
      "No. Los créditos comprados no tienen fecha de expiración. Podés usarlos cuando quieras.",
  },
  {
    question: "¿Qué información analizan de mi CV?",
    answer:
      "Evaluamos la estructura general, sección por sección, palabras clave relevantes, alineación con el mercado laboral y te damos una puntuación global con sugerencias mejoras.",
  },
  {
    question: "¿Es seguro subir mi CV?",
    answer:
      "Sí. Tu CV se procesa de forma segura y se elimina una vez finalizado el análisis. No compartimos tu información con terceros.",
  },
  {
    question: "¿Puedo usar la plataforma sin registrarme?",
    answer:
      "Necesitás una cuenta para acceder al análisis de CV. El registro es rápido y te da 3 análisis gratuitos para probar.",
  },
]

// ---------------------------------------------------------------------------
// CTA Final
// ---------------------------------------------------------------------------

export const CTA_FINAL: CTAData = {
  heading: "¿Listo para mejorar tu CV?",
  subheading:
    "Empezá con 3 análisis gratuitos. Sin tarjeta de crédito, sin compromiso.",
  primaryLabel: "Crear cuenta gratis",
  primaryHref: ROUTES.REGISTER,
}

// ---------------------------------------------------------------------------
// Free Credits Info (used in pricing preview)
// ---------------------------------------------------------------------------

export const FREE_CREDITS_INFO = {
  count: 3,
  label: "análisis gratuitos al registrarte",
} as const
