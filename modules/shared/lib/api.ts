import axios from "axios"
import { TOKEN_KEY } from "./constants"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
})

// Request interceptor: attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor: on 402 redirect to /pricing, on 401 clear token and redirect to /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      // Handle 402 Payment Required - redirect to pricing only if X-Needs-Payment header is present
      if (error.response?.status === 402) {
        const needsPayment = error.response.headers['x-needs-payment']
        if (needsPayment === 'true') {
          window.location.href = "/pricing"
          return new Promise(() => {}) // swallow to prevent further handling
        }
      }
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export { api }
