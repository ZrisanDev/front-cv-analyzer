import { useCallback } from "react"
import type { AxiosRequestConfig } from "axios"
import { api } from "@/modules/shared/lib/api"
import type { ApiError } from "@/modules/shared/types/common"
import toast from "react-hot-toast"

export function useApi() {
  const request = useCallback(async <T>(
    config: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await api.request<T>(config)
      return response.data
    } catch (error: unknown) {
      const apiError = extractErrorMessage(error)
      toast.error(apiError)
      throw error
    }
  }, [])

  return { request }
}

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: ApiError | { message?: string }; status?: number }
    }
    const data = axiosError.response?.data

    if (data && typeof data === "object" && "message" in data) {
      return data.message as string
    }

    if (axiosError.response?.status === 500) {
      return "An unexpected error occurred. Please try again."
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred. Please try again."
}
