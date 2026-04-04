"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { Trash2, History } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/modules/shared/components/EmptyState"
import { TableSkeleton } from "@/modules/shared/components/LoadingSkeleton"
import type { HistoryItem } from "@/modules/history/types/history"

const PAGE_SIZE = 10

interface HistoryListProps {
  items: HistoryItem[]
  total: number
  page: number
  isLoading: boolean
  onPageChange: (page: number) => void
  onDeleteClick: (item: HistoryItem) => void
}

function formatDateString(dateStr: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TemporalAPI = (globalThis as any).Temporal
  if (TemporalAPI?.PlainDate) {
    try {
      const date = TemporalAPI.PlainDate.from(dateStr)
      return date.toLocaleString("es-AR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      // Fall through to Date fallback
    }
  }
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr))
}

function getScoreBadgeVariant(
  score: number
): "default" | "secondary" | "destructive" {
  if (score >= 70) return "default"
  if (score >= 40) return "secondary"
  return "destructive"
}

function getStatusBadgeVariant(
  status: HistoryItem["status"]
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "completed":
      return "default"
    case "processing":
      return "secondary"
    case "failed":
      return "destructive"
    default:
      return "secondary"
  }
}

function getStatusLabel(status: HistoryItem["status"]): string {
  switch (status) {
    case "completed":
      return "Completado"
    case "processing":
      return "Procesando"
    case "failed":
      return "Fallido"
    default:
      return status
  }
}

export function HistoryList({
  items,
  total,
  page,
  isLoading,
  onPageChange,
  onDeleteClick,
}: HistoryListProps) {
  const router = useRouter()

  const totalPages = useMemo(
    () => Math.ceil(total / PAGE_SIZE),
    [total]
  )

  if (isLoading) {
    return <TableSkeleton rows={5} cols={5} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Sin historial"
        description="Aun no tienes analisis realizados. Ve a Analizar para comenzar."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Puesto</TableHead>
            <TableHead>Puntuacion</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() => router.push(`/results?id=${item.id}`)}
            >
              <TableCell>{formatDateString(item.created_at)}</TableCell>
              <TableCell>{item.job_url || "Sin URL"}</TableCell>
              <TableCell>
                {item.compatibility_score !== null ? (
                  <Badge variant={getScoreBadgeVariant(item.compatibility_score)}>
                    {item.compatibility_score}%
                  </Badge>
                ) : (
                  <Badge variant="secondary">N/A</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(item.status)}>
                  {getStatusLabel(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteClick(item)
                  }}
                  aria-label="Eliminar analisis"
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Pagina {page} de {totalPages} ({total} resultados)
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
