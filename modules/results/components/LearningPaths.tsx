"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Target, GraduationCap, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { Keyword } from "@/modules/results/types/results"

interface LearningPathsProps {
  learningPaths: Keyword[]
  className?: string
}

export function LearningPaths({ learningPaths, className }: LearningPathsProps) {
  const [expandedPath, setExpandedPath] = useState<string | null>(null)

  if (!learningPaths || learningPaths.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h2 className="mb-4 text-lg font-semibold">Rutas de Aprendizaje</h2>
      <div className="flex flex-col gap-4">
        {learningPaths.map((path) => (
          <Card key={path.keyword} className="border-primary/20">
            <CardHeader
              className="flex flex-row items-center justify-between gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedPath(expandedPath === path.keyword ? null : path.keyword)}
            >
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{path.keyword}</Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {expandedPath === path.keyword ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </Button>
            </CardHeader>

            {expandedPath === path.keyword && (
              <CardContent className="flex flex-col gap-5">
                {/* Description */}
                <div className="flex gap-3">
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Que es</h4>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                  </div>
                </div>

                {/* Why it matters */}
                <div className="flex gap-3">
                  <Target className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Por que importa</h4>
                    <p className="text-sm text-muted-foreground">{path.whyItMatters}</p>
                  </div>
                </div>

                {/* Learning path */}
                <div className="flex gap-3">
                  <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Como aprenderlo</h4>
                    <p className="text-sm text-muted-foreground">{path.learningPath}</p>
                  </div>
                </div>

                {/* Resources */}
                {path.resources.length > 0 && (
                  <div className="flex gap-3">
                    <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="mb-2 text-sm font-medium">Recursos sugeridos</h4>
                      <ul className="flex flex-col gap-1.5">
                        {path.resources.map((resource, i) => (
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
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
