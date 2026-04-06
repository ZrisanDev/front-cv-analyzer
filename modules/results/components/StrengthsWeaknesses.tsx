"use client"

import { CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StrengthsWeaknessesProps {
  strengths: string[]
  weaknesses: string[]
  className?: string
}

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
  className,
}: StrengthsWeaknessesProps) {
  const strengthList = strengths ?? []
  const weaknessList = weaknesses ?? []

  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      {/* Strengths */}
      <div className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle className="size-4 text-emerald-500" />
          Fortalezas ({strengthList.length})
        </h3>
        {strengthList.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {strengthList.map((strength, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg bg-emerald-500/5 p-3 text-sm"
              >
                <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No se identificaron fortalezas.</p>
        )}
      </div>

      {/* Weaknesses */}
      <div className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="size-4 text-amber-500" />
          Debilidades ({weaknessList.length})
        </h3>
        {weaknessList.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {weaknessList.map((weakness, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg bg-amber-500/5 p-3 text-sm"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No se identificaron debilidades.</p>
        )}
      </div>
    </div>
  )
}
