"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Target, GraduationCap, ExternalLink, X } from "lucide-react"
import type { Keyword } from "@/modules/results/types/results"

interface KeywordDetailProps {
  keyword: Keyword | null
  onClose: () => void
  className?: string
}

export function KeywordDetail({ keyword, onClose, className }: KeywordDetailProps) {
  if (!keyword) return null

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{keyword.keyword}</Badge>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close detail"
          >
            <X className="size-4" />
          </button>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Description */}
          <div className="flex gap-3">
            <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <h4 className="mb-1 text-sm font-medium">Que es</h4>
              <p className="text-sm text-muted-foreground">{keyword.description}</p>
            </div>
          </div>

          {/* Why it matters */}
          <div className="flex gap-3">
            <Target className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <h4 className="mb-1 text-sm font-medium">Por que importa</h4>
              <p className="text-sm text-muted-foreground">{keyword.whyItMatters}</p>
            </div>
          </div>

          {/* Learning path */}
          <div className="flex gap-3">
            <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <h4 className="mb-1 text-sm font-medium">Ruta de aprendizaje</h4>
              <p className="text-sm text-muted-foreground">{keyword.learningPath}</p>
            </div>
          </div>

          {/* Resources */}
          {keyword.resources.length > 0 && (
            <div className="flex gap-3">
              <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="mb-2 text-sm font-medium">Recursos sugeridos</h4>
                <ul className="flex flex-col gap-1.5">
                  {keyword.resources.map((resource, i) => (
                    <li key={i}>
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        <ExternalLink className="size-3" />
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
