"use client"

import Link from "next/link"
import { Coins } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AnalysisForm } from "@/modules/analysis/components/AnalysisForm"
import { useCreditFlow } from "@/modules/payment"
import { CreditUpsellModal } from "@/modules/payment"
import { ROUTES } from "@/modules/shared/lib/constants"

export default function AnalyzePage() {
  const { hasCredits, showUpsell, dismissUpsell, isLoading } = useCreditFlow()

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <>
      {hasCredits && <AnalysisForm />}

      {!hasCredits && !showUpsell && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Coins className="size-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Necesitás créditos para analizar CVs.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.PRICING}>Ver planes</Link>
          </Button>
        </div>
      )}

      <CreditUpsellModal
        open={showUpsell}
        onOpenChange={(open) => {
          if (!open) dismissUpsell()
        }}
        onDismiss={dismissUpsell}
      />
    </>
  )
}
