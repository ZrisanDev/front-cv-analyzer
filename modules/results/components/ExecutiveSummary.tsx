"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquareQuote } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExecutiveSummaryProps {
  summary: string | null | undefined
  className?: string
}

export function ExecutiveSummary({ summary, className }: ExecutiveSummaryProps) {
  if (!summary) {
    return null
  }

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardContent className="flex gap-3 pt-0">
        <MessageSquareQuote className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-foreground">
          {summary}
        </p>
      </CardContent>
    </Card>
  )
}
