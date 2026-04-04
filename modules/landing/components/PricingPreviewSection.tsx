"use client"

import { ArrowRight, Gift, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useCreditPackages } from "@/modules/payment/hooks/useCredits"
import { FREE_CREDITS_INFO } from "../lib/constants"
import { ROUTES } from "@/modules/shared/lib/constants"
import Link from "next/link"

export function PricingPreviewSection() {
  const { data: packages, isLoading, isError } = useCreditPackages()

  if (isLoading) {
    return (
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <Skeleton className="mx-auto mb-3 h-8 w-48" />
            <Skeleton className="mx-auto h-5 w-72" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
          <Skeleton className="mx-auto mt-8 h-20 w-full max-w-2xl rounded-xl" />
          <Skeleton className="mx-auto mt-8 h-10 w-40" />
        </div>
      </section>
    )
  }

  if (isError || !packages) {
    return (
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Créditos a tu medida
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              Elegí el paquete que mejor se adapte a tus necesidades.
            </p>
          </div>
          <p className="text-muted-foreground">
            No se pudieron cargar los precios. Por favor{" "}
            <Button variant="link" className="h-auto px-1" asChild>
              <Link href={ROUTES.PRICING}>
                ve a la página de precios
              </Link>
            </Button>
            .
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Créditos a tu medida
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Elegí el paquete que mejor se adapte a tus necesidades. Sin suscripciones, sin letra chica.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {packages.map((pkg) => {
            const isPopular = pkg.package_type === "pack_50"
            const pricePerAnalysis = pkg.price_usd / pkg.credits_count

            return (
              <Card
                key={pkg.package_type}
                className={`relative text-center transition-all ${
                  isPopular
                    ? "border-primary ring-2 ring-primary scale-[1.02]"
                    : "hover:border-muted-foreground/30"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    Más popular
                  </span>
                )}
                <CardContent className="flex flex-col items-center gap-3 pt-8 pb-4">
                  <p className="text-sm text-muted-foreground">
                    Pack {pkg.credits_count}
                  </p>
                  <p className="text-3xl font-bold">
                    ${pkg.price_usd.toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      USD
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${pricePerAnalysis.toFixed(2)} por análisis
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Free credits banner */}
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/30 p-4 text-center">
          <Gift className="size-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {FREE_CREDITS_INFO.count}
            </span>{" "}
            {FREE_CREDITS_INFO.label}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href={ROUTES.PRICING}>
              Ver todos los planes
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
