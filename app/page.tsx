"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { ROUTES } from "@/modules/shared/lib/constants"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated) {
      router.replace(ROUTES.ANALYZE)
    } else {
      router.replace(ROUTES.LOGIN)
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  )
}
