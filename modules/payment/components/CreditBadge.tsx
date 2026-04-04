"use client"

import { Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CreditBadgeProps {
  freeRemaining: number
  paidCredits: number
}

export function CreditBadge({ freeRemaining, paidCredits }: CreditBadgeProps) {
  const total = freeRemaining + paidCredits

  if (total === 0) {
    return (
      <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs">
        <Coins className="size-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">0 créditos</span>
      </Badge>
    )
  }

  const label = total === 1 ? "crédito disponible" : "créditos disponibles"

  return (
    <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs">
      <Coins className="size-3.5 text-primary" />
      <span className="font-medium">{total} {label}</span>
      <span className="hidden text-muted-foreground sm:inline">
        ({freeRemaining} gratis + {paidCredits} pagos)
      </span>
    </Badge>
  )
}
