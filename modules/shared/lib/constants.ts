export const TOKEN_KEY = "cv_analyzer_token" as const

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  RECOVER: "/recover",
  ANALYZE: "/analyze",
  RESULTS: "/results",
  HISTORY: "/history",
  DASHBOARD: "/dashboard",
  PRICING: "/pricing",
  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_ERROR: "/payment/error",
  PAYMENT_PENDING: "/payment/pending",
} as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
export const MAX_FILE_SIZE_LABEL = "10MB"

export const ACCEPTED_FILE_TYPES = ".pdf" as const
export const ACCEPTED_FILE_TYPES_LABEL = "PDF" as const
