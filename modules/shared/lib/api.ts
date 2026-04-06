import axios from "axios"
import { TOKEN_KEY } from "./constants"

const REFRESH_TOKEN_KEY = 'cv_analyzer_refresh_token'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
})

// Flag to prevent infinite refresh loops
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

// Request interceptor: attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  // Skip ngrok browser warning
  config.headers["ngrok-skip-browser-warning"] = "any"
  return config
})

// Response interceptor: on 402 redirect to /pricing, on 401 try to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (typeof window !== "undefined") {
      // Handle 402 Payment Required - redirect to pricing only if X-Needs-Payment header is present
      if (error.response?.status === 402) {
        const needsPayment = error.response.headers['x-needs-payment']
        if (needsPayment === 'true') {
          window.location.href = "/pricing"
          return new Promise(() => {}) // swallow to prevent further handling
        }
      }

      // Handle 401 Unauthorized - try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        if (!isRefreshing) {
          isRefreshing = true
          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

            if (refreshToken) {
              console.log('[API] Attempting to refresh token...')
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/auth/refresh`,
                { refresh_token: refreshToken }
              )

              const newAccessToken = response.data.access_token
              const newRefreshToken = response.data.refresh_token

              // Update tokens in localStorage
              localStorage.setItem(TOKEN_KEY, newAccessToken)
              localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)

              // Update cookie
              const date = new Date()
              date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
              document.cookie = `${TOKEN_KEY}=${newAccessToken}; expires=${date.toUTCString()}; path=/; SameSite=Lax`

              console.log('[API] Token refreshed successfully')

              // Process queued requests
              failedQueue.forEach(prom => prom.resolve())
              failedQueue = []

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
              return api(originalRequest)
            } else {
              // No refresh token available, logout
              console.log('[API] No refresh token available, logging out')
              throw new Error('No refresh token available')
            }
          } catch (refreshError) {
            console.error('[API] Failed to refresh token:', refreshError)

            // Process queued requests with error
            failedQueue.forEach(prom => prom.reject(refreshError))
            failedQueue = []

            // Clear tokens and redirect to login
            console.log('[API] Clearing tokens and redirecting to login')
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
            document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
            window.location.href = "/login"
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        }

        // If already refreshing, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err))
      }
    }

    return Promise.reject(error)
  }
)

export { api }
