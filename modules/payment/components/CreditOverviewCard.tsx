"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Coins, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCreditsBalance } from "@/modules/payment/hooks/useCredits"
import type { UserCredits } from "@/modules/payment/types/payment"

type CreditColor = {
  bg: string
  text: string
  progress: string
}

function getCreditColor(remaining: number): CreditColor {
  if (remaining > 2) {
    return { bg: "bg-emerald-500/10", text: "text-emerald-500", progress: "bg-emerald-500" }
  }
  if (remaining > 0) {
    return { bg: "bg-amber-500/10", text: "text-amber-500", progress: "bg-amber-500" }
  }
  return { bg: "bg-red-500/10", text: "text-red-500", progress: "bg-red-500" }
}

function calculateProgress(data: UserCredits): number {
  if (data.free_analyses_limit === 0) return 0
  const raw = (data.free_analyses_count / data.free_analyses_limit) * 100
  return Math.min(Math.max(raw, 0), 100)
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded" data-testid="skeleton-placeholder" />
          <Skeleton className="h-5 w-32" data-testid="skeleton-placeholder" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-2 w-full" data-testid="skeleton-placeholder" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" data-testid="skeleton-placeholder" />
            <Skeleton className="h-16 w-full" data-testid="skeleton-placeholder" />
          </div>
          <Skeleton className="h-12 w-full" data-testid="skeleton-placeholder" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * CreditOverviewCard displays the user's credit balance with a progress bar
 * showing free credit consumption and contextual call-to-action buttons.
 */
export function CreditOverviewCard() {
  const { data, isLoading, isError, refetch } = useCreditsBalance()

  const percentage = useMemo(() => {
    if (!data) return 0
    return calculateProgress(data)
  }, [data])

  const color = useMemo(() => {
    if (!data) return getCreditColor(0)
    return getCreditColor(data.free_analyses_remaining)
  }, [data])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <Card>
        <CardContent>
          <div role="alert" className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertCircle className="size-5 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              No se pudo cargar la información de créditos.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const showCta = data.free_analyses_remaining <= 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`flex size-8 items-center justify-center rounded-lg ${color.bg}`}>
            <Coins className={`size-4 ${color.text}`} />
          </div>
          Créditos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <Progress
              value={percentage}
              aria-label="Créditos gratuitos consumidos"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {data.free_analyses_remaining} de {data.free_analyses_limit} análisis gratuitos restantes
            </p>
          </div>

          {/* Credit Counts */}
          <div className="grid grid-cols-2 gap-4">
            {/* Free Credits */}
            <div className="flex items-center gap-3">
              <div className={`flex size-10 items-center justify-center rounded-lg ${color.bg}`}>
                <Coins className={`size-5 ${color.text}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Gratuitos</span>
                <span className="text-2xl font-bold tabular-nums">{data.free_analyses_remaining}</span>
              </div>
            </div>

            {/* Paid Credits */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Coins className="size-5 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Pagos</span>
                <span className="text-2xl font-bold tabular-nums">{data.paid_analyses_credits}</span>
              </div>
            </div>
          </div>

          {/* Total Analyses */}
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">
              Total de análisis realizados: <strong className="text-foreground">{data.total_analyses_used}</strong>
            </span>
          </div>

          {/* CTA */}
          {showCta && (
            <Button asChild className="w-full">
              <Link href="/pricing" aria-label="Comprar más créditos">
                Comprar más
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
