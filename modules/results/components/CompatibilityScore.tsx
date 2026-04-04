"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, AlertTriangle, XCircle } from "lucide-react"

interface CompatibilityScoreProps {
  score: number
  className?: string
}

function getScoreConfig(score: number): {
  color: string
  bgColor: string
  textColor: string
  progressClass: string
  label: string
  Icon: LucideIcon
} {
  if (score >= 70) {
    return {
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-600",
      progressClass: "[&>div]:bg-emerald-500",
      label: "Excelente compatibilidad",
      Icon: TrendingUp,
    }
  }
  if (score >= 40) {
    return {
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600",
      progressClass: "[&>div]:bg-amber-500",
      label: "Compatibilidad moderada",
      Icon: AlertTriangle,
    }
  }
  return {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
    progressClass: "[&>div]:bg-red-500",
    label: "Baja compatibilidad",
    Icon: XCircle,
  }
}

export function CompatibilityScore({ score, className }: CompatibilityScoreProps) {
  const config = getScoreConfig(score)
  const { Icon } = config

  return (
    <div className={cn("flex flex-col items-center gap-4 py-6", className)}>
      {/* Circular indicator */}
      <div className="relative flex items-center justify-center">
        <svg className="size-40 -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / 100)}`}
            className={config.color}
            style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
          />
        </svg>
        {/* Score number in the center */}
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-4xl font-bold tabular-nums", config.textColor)}>
            {Math.round(score)}%
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-2">
        <Icon className={cn("size-4", config.color)} />
        <span className={cn("text-sm font-medium", config.textColor)}>
          {config.label}
        </span>
      </div>

      {/* Linear progress bar */}
      <div className="w-full max-w-xs">
        <Progress
          value={score}
          className={cn("h-2", config.progressClass)}
        />
      </div>
    </div>
  )
}
