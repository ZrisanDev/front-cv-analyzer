"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useAnalysisResult } from "@/modules/results/hooks/useResults"
import { ExecutiveSummary } from "@/modules/results/components/ExecutiveSummary"
import { CompatibilityScore } from "@/modules/results/components/CompatibilityScore"
import { KeywordsList } from "@/modules/results/components/KeywordsList"
import { KeywordDetail } from "@/modules/results/components/KeywordDetail"
import { StrengthsWeaknesses } from "@/modules/results/components/StrengthsWeaknesses"
import { LearningPaths } from "@/modules/results/components/LearningPaths"
import { CardSkeleton } from "@/modules/shared/components/LoadingSkeleton"
import { EmptyState } from "@/modules/shared/components/EmptyState"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileSearch, Loader2 } from "lucide-react"
import type { Keyword } from "@/modules/results/types/results"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const analysisId = searchParams.get("id")

  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null)

  const { data: result, isLoading, isError, error } = useAnalysisResult(analysisId)

  const formattedDate = useMemo(() => {
    if (!result?.created_at) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TemporalAPI = (globalThis as any).Temporal
    if (TemporalAPI?.PlainDate) {
      try {
        const date = TemporalAPI.PlainDate.from(result.created_at)
        return date.toLocaleString("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } catch {
        // Fall through to Date fallback
      }
    }
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(result.created_at))
  }, [result?.created_at])

  // --- States ---

  if (!analysisId) {
    return (
      <EmptyState
        icon={FileSearch}
        title="Sin analisis seleccionado"
        description="Selecciona un analisis desde el historial para ver los resultados."
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <CardSkeleton className="h-32" />
        <CardSkeleton className="h-48" />
        <CardSkeleton className="h-40" />
        <CardSkeleton className="h-40" />
      </div>
    )
  }

  if (isError || !result) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "No se pudieron cargar los resultados. Intenta nuevamente."}
        </AlertDescription>
      </Alert>
    )
  }

  // Show loading state when analysis is still pending or processing
  if (!result.analysis_result) {
    const isPending = result.status === "pending" || result.status === "processing"

    return (
      <div className="flex flex-col gap-8">
        {/* Date header */}
        {formattedDate && (
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        )}

        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="size-12 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {result.status === "pending" ? "Tu análisis está en cola" : "Analizando tu CV..."}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Esto puede tomar unos minutos. Por favor espera...
              </p>
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {result.error_message || "No se pudo completar el análisis. Intenta nuevamente."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  // --- Render ---

  return (
    <div className="flex flex-col gap-8">
      {/* Date header */}
      {formattedDate && (
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      )}

      {/* Executive Summary */}
      <ExecutiveSummary summary={result.analysis_result.summary} />

      {/* Compatibility Score */}
      <CompatibilityScore score={result.analysis_result.compatibility} />

      {/* Keywords */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Keywords</h2>
        <KeywordsList
          presentKeywords={result.analysis_result.keywords_present}
          missingKeywords={result.analysis_result.keywords_missing}
          onSelectKeyword={setSelectedKeyword}
        />
      </div>

      {/* Keyword Detail (expandable on click) */}
      <KeywordDetail
        keyword={selectedKeyword}
        onClose={() => setSelectedKeyword(null)}
      />

      {/* Strengths & Weaknesses */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Fortalezas y Debilidades</h2>
        <StrengthsWeaknesses
          strengths={result.analysis_result.strengths}
          weaknesses={result.analysis_result.weaknesses}
        />
      </div>

      {/* Learning Paths */}
      {result.analysis_result.learning_paths && result.analysis_result.learning_paths.length > 0 && (
        <LearningPaths learningPaths={result.analysis_result.learning_paths} />
      )}
    </div>
  )
}
