"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HERO } from "../lib/constants"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:py-28 lg:py-36">
      {/* Eyebrow badge */}
      <span className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
        3 análisis gratuitos al registrarte
      </span>

      <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        {HERO.heading}
      </h1>

      <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
        {HERO.subheading}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href={HERO.primaryHref}>
            {HERO.primaryLabel}
            <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </Button>

        {HERO.secondaryLabel && HERO.secondaryHref && (
          <Button size="lg" variant="outline" asChild>
            <Link href={HERO.secondaryHref}>{HERO.secondaryLabel}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
