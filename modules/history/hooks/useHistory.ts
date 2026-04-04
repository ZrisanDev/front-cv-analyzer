import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  getHistory as getHistoryApi,
  deleteAnalysis as deleteAnalysisApi,
} from "@/modules/history/api/history"

const HISTORY_KEYS = {
  all: ["history"] as const,
  list: (page: number, pageSize: number) =>
    [...HISTORY_KEYS.all, "list", page, pageSize] as const,
}

export function useHistory(page: number, pageSize: number) {
  return useQuery({
    queryKey: HISTORY_KEYS.list(page, pageSize),
    queryFn: () => getHistoryApi(page, pageSize),
  })
}

export function useDeleteAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAnalysisApi(id),
    onSuccess: () => {
      toast.success("Analisis eliminado correctamente")
      queryClient.invalidateQueries({ queryKey: HISTORY_KEYS.all })
    },
    onError: () => {
      toast.error("No se pudo eliminar el analisis. Intenta nuevamente.")
    },
  })
}
