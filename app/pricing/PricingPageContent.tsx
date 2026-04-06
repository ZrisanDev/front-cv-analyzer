"use client"

import { useState } from "react"
import { CreditCard, Loader2, ShieldCheck, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useCreditPackages } from "@/modules/payment/hooks/useCredits"
import { createPackagePreference } from "@/modules/payment/api/credits"
import { PricingCard } from "@/modules/payment/components/PricingCard"
import { ROUTES } from "@/modules/shared/lib/constants"
import type { PackageType } from "@/modules/payment/types/payment"
import Link from "next/link"

export function PricingPageContent() {
  const { data: packages, isLoading, isError } = useCreditPackages()
  const [purchasing, setPurchasing] = useState<PackageType | null>(null)

  const handleSelect = async (packageType: PackageType) => {
    setPurchasing(packageType)
    try {
      const preference = await createPackagePreference(packageType)
      window.location.href = preference.payment_url
    } catch (error) {
      console.error("[PricingPageContent] Error in handleSelect:", error)
      setPurchasing(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <Skeleton className="mx-auto mb-4 h-8 w-64" />
            <Skeleton className="mx-auto h-5 w-96" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !packages) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground mb-4">
            No se pudieron cargar los paquetes de créditos. Por favor intenta nuevamente.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
              Elige tu Paquete de Análisis
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Obtén más análisis para mejorar tu CV y aumentar tus chances en la búsqueda laboral.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg.package_type} className="relative">
                <PricingCard
                  pkg={pkg}
                  isPopular={pkg.package_type === "pack_50"}
                  onSelect={handleSelect}
                />
                {purchasing === pkg.package_type && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80">
                    <Loader2 className="size-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                Pagos seguros con MercadoPago
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="size-4" />
                Conversión automática a tu moneda
              </span>
            </div>
            <p>Los créditos nunca expiran</p>
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.DASHBOARD}>
                Volver al dashboard
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
