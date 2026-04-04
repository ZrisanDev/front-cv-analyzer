"use client"

import {
  FileSearch,
  Sparkles,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FEATURES } from "../lib/constants"
import type { FeatureItem } from "../types/landing"

const ICON_MAP: Record<string, LucideIcon> = {
  FileSearch,
  Sparkles,
  ShieldCheck,
  Zap,
}

function FeatureCard({ item }: { item: FeatureItem }) {
  const Icon = ICON_MAP[item.icon]

  return (
    <Card className="text-center transition-all hover:border-muted-foreground/30">
      <CardHeader>
        {Icon && (
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
        )}
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  )
}

export function FeaturesSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Herramientas diseñadas para que tu CV destaque en cada proceso de selección.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.icon} item={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
