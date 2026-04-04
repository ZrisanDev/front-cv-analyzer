"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { getMe } from "@/modules/auth/api/auth"
import { TOKEN_KEY } from "@/modules/shared/lib/constants"

export function useSession() {
  const { user, token, isAuthenticated, setUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const validateToken = async () => {
      // If there's a token but no user, validate it
      if (token && !user) {
        try {
          const me = await getMe()
          setUser(me)
        } catch {
          // Token is invalid, clear it
          localStorage.removeItem(TOKEN_KEY)
          router.push("/login")
        }
      }
    }

    validateToken()
  }, [token, user, setUser, router])

  return { user, token, isAuthenticated, isLoading: !!token && !user }
}
