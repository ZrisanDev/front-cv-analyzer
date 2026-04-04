"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { usePrice } from "@/modules/analysis/hooks/useAnalysis"

interface PriceDisplayProps {
  className?: string
}

export function PriceDisplay({ className }: PriceDisplayProps) {
  const { data: price, isLoading, isError } = usePrice()

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className ?? ""}`}>
        <Skeleton className="h-6 w-24" />
      </div>
    )
  }

  if (isError || !price) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-sm text-muted-foreground">Price:</span>
      <Badge variant="secondary">
        {price.currency} {price.amount.toFixed(2)}
      </Badge>
    </div>
  )
}
