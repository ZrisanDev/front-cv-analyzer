export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface RecoverPasswordPayload {
  email: string
}

export interface User {
  id: string
  name: string
  email: string
  is_active?: boolean
  free_analyses_count?: number
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface TokenRefreshRequest {
  refresh_token: string
}

export interface LogoutRequest {
  refresh_token?: string | null
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}
