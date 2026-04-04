"use client"

import { Upload, Cpu, FileBarChart } from "lucide-react"
import { HOW_IT_WORKS } from "../lib/constants"
import type { HowItWorksStep } from "../types/landing"
import type { LucideIcon } from "lucide-react"

const STEP_ICONS: Record<number, LucideIcon> = {
  1: Upload,
  2: Cpu,
  3: FileBarChart,
}

function StepCard({ step: stepData }: { step: HowItWorksStep }) {
  const Icon = STEP_ICONS[stepData.step]

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
        {Icon ? (
          <Icon className="size-6 text-primary" />
        ) : (
          <span className="text-lg font-bold text-primary">{stepData.step}</span>
        )}
      </div>
      <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
        Paso {stepData.step}
      </span>
      <h3 className="mb-2 text-lg font-semibold">{stepData.title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">
        {stepData.description}
      </p>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            ¿Cómo funciona?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Tres pasos simples para obtener un análisis profesional de tu CV.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <StepCard key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  )
}
