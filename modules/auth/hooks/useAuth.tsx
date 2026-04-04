"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { User } from "@/modules/auth/types/auth"
import { TOKEN_KEY } from "@/modules/shared/lib/constants"
import { login as loginApi, register as registerApi, getMe as getMeApi } from "@/modules/auth/api/auth"
import toast from "react-hot-toast"

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(TOKEN_KEY)
      if (stored) {
        // Sync cookie from localStorage (e.g. after page refresh)
        document.cookie = `${TOKEN_KEY}=${stored}; path=/; SameSite=Lax; max-age=3600`
      }
      return stored
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await loginApi({ email, password })
      const accessToken = response.access_token
      localStorage.setItem(TOKEN_KEY, accessToken)
      // Also set cookie for middleware (same-site, path=/)
      document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; SameSite=Lax; max-age=3600`
      setToken(accessToken)
      const user = await getMeApi()
      setUserState(user)
      toast.success("Welcome back!")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      await registerApi({ name, email, password })
      // Backend returns User object (no token) — user must login
      toast.success("Account created! Please sign in.")
      window.location.href = "/login"
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    // Also clear cookie
    document.cookie = `${TOKEN_KEY}=; path=/; SameSite=Lax; max-age=0`
    setToken(null)
    setUserState(null)
    window.location.href = "/login"
  }, [])

  const setUser = useCallback((u: User) => {
    setUserState(u)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, token, isLoading, login, register, logout, setUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
