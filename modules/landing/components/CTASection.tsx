"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CTA_FINAL } from "../lib/constants"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {CTA_FINAL.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          {CTA_FINAL.subheading}
        </p>

        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href={CTA_FINAL.primaryHref}>
              {CTA_FINAL.primaryLabel}
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
