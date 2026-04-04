"use client"

import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CreditPackage, PackageType } from "@/modules/payment/types/payment"

interface PricingCardProps {
  pkg: CreditPackage
  isPopular?: boolean
  onSelect: (packageType: PackageType) => void
}

export function PricingCard({ pkg, isPopular = false, onSelect }: PricingCardProps) {
  const pricePerCredit = (pkg.price_usd / pkg.credits_count).toFixed(2)

  return (
    <Card
      className={`relative flex flex-col transition-all ${
        isPopular
          ? "border-primary ring-2 ring-primary scale-[1.02] shadow-lg"
          : "hover:border-muted-foreground/30"
      }`}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Más popular
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">
          Pack {pkg.credits_count}
        </CardTitle>
        <CardDescription className="text-sm">
          Créditos de análisis
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold">
            ${pkg.price_usd.toFixed(2)}
            <span className="text-base font-normal text-muted-foreground ml-1">USD</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ${pricePerCredit} por análisis
          </p>
        </div>

        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2">
            <Check className="size-4 text-primary shrink-0" />
            <span>{pkg.credits_count} análisis de CV</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-primary shrink-0" />
            <span>Sin fecha de expiración</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-primary shrink-0" />
            <span>Acceso inmediato</span>
          </li>
        </ul>

        <div className="mt-auto pt-4">
          <Button
            className="w-full"
            size="lg"
            variant={isPopular ? "default" : "outline"}
            onClick={() => onSelect(pkg.package_type)}
          >
            Comprar ahora
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
