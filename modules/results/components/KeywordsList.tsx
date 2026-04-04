"use client"

import { Badge } from "@/components/ui/badge"
import type { Keyword } from "@/modules/results/types/results"

interface KeywordsListProps {
  presentKeywords: Keyword[]
  missingKeywords: Keyword[]
  onSelectKeyword?: (keyword: Keyword) => void
  className?: string
}

export function KeywordsList({
  presentKeywords,
  missingKeywords,
  onSelectKeyword,
  className,
}: KeywordsListProps) {
  return (
    <div className={className}>
      {/* Present keywords */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Keywords Presentes ({presentKeywords.length})
        </h3>
        {presentKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {presentKeywords.map((kw) => (
              <Badge
                key={kw.keyword}
                variant="default"
                className="cursor-default bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20"
              >
                {kw.keyword}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No se encontraron keywords presentes.</p>
        )}
      </div>

      {/* Missing keywords */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Keywords Faltantes ({missingKeywords.length})
        </h3>
        {missingKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => (
              <Badge
                key={kw.keyword}
                variant="destructive"
                className="cursor-pointer"
                onClick={() => onSelectKeyword?.(kw)}
              >
                {kw.keyword}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay keywords faltantes. Excelente!
          </p>
        )}
      </div>
    </div>
  )
}
