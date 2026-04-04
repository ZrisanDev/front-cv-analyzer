"use client"

import { useState, useCallback } from "react"
import { useHistory, useDeleteAnalysis } from "@/modules/history/hooks/useHistory"
import { HistoryList } from "@/modules/history/components/HistoryList"
import { DeleteConfirmDialog } from "@/modules/history/components/DeleteConfirmDialog"
import type { HistoryItem } from "@/modules/history/types/history"

const DEFAULT_PAGE_SIZE = 10

export default function HistoryPage() {
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<HistoryItem | null>(null)

  const { data, isLoading } = useHistory(page, DEFAULT_PAGE_SIZE)
  const deleteAnalysis = useDeleteAnalysis()

  const handleDeleteClick = useCallback((item: HistoryItem) => {
    setDeleteTarget(item)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return
    await deleteAnalysis.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }, [deleteTarget, deleteAnalysis])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Historial</h1>

      <HistoryList
        items={data?.items ?? []}
        total={data?.total ?? 0}
        page={page}
        isLoading={isLoading}
        onPageChange={setPage}
        onDeleteClick={handleDeleteClick}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        item={deleteTarget}
        isDeleting={deleteAnalysis.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
