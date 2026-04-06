"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { User } from "@/modules/auth/types/auth"
import { TOKEN_KEY } from "@/modules/shared/lib/constants"
import { login as loginApi, register as registerApi, getMe as getMeApi } from "@/modules/auth/api/auth"
import toast from "react-hot-toast"

const REFRESH_TOKEN_KEY = 'cv_analyzer_refresh_token'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  /** Whether auth is still initializing (fetching user data from backend) */
  isInitializing: boolean
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
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Helper function to set cookie
  const setCookie = useCallback((name: string, value: string, days: number) => {
    if (typeof window !== "undefined") {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      const expires = `expires=${date.toUTCString()}`
      document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`
    }
  }, [])

  // Helper function to delete cookie
  const deleteCookie = useCallback((name: string) => {
    if (typeof window !== "undefined") {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
    }
  }, [])

  // Sync cookie from localStorage on mount
  useEffect(() => {
    if (token) {
      setCookie(TOKEN_KEY, token, 7)
    }
  }, [token, setCookie])

  // Recover user from backend on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        try {
          const userData = await getMeApi()
          setUserState(userData)
        } catch (error) {
          // Token invalid or expired, clear it and redirect
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          deleteCookie(TOKEN_KEY)
          setToken(null)
          // Redirect to login immediately
          window.location.href = '/login'
          return
        }
      }

      setIsInitializing(false)
    }

    initializeAuth()
  }, [token, user, deleteCookie])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await loginApi({ email, password })
      const accessToken = response.access_token
      const refreshToken = response.refresh_token
      localStorage.setItem(TOKEN_KEY, accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      // Set cookie for (7 days)
      setCookie(TOKEN_KEY, accessToken, 7)
      setToken(accessToken)
      const user = await getMeApi()
      setUserState(user)
      toast.success("Welcome back!")
    } finally {
      setIsLoading(false)
    }
  }, [setCookie])

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
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    deleteCookie(TOKEN_KEY)
    setToken(null)
    setUserState(null)
    window.location.href = "/login"
  }, [deleteCookie])

  const setUser = useCallback((u: User) => {
    setUserState(u)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      isInitializing,
      login,
      register,
      logout,
      setUser,
    }),
    [user, token, isLoading, isInitializing, login, register, logout, setUser]
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
