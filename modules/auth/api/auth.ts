import { api } from "@/modules/shared/lib/api";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginPayload,
  LogoutRequest,
  RecoverPasswordPayload,
  RegisterPayload,
  ResetPasswordRequest,
  TokenRefreshRequest,
  User,
} from "@/modules/auth/types/auth";
import type { ApiResponse } from "@/modules/shared/types/common";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/login",
    payload,
  );
  return data;
}

export async function register(
  payload: RegisterPayload,
): Promise<User> {
  const { data } = await api.post<User>(
    "/api/auth/register",
    payload,
  );
  return data;
}

export async function recoverPassword(
  payload: RecoverPasswordPayload,
): Promise<void> {
  await api.post<ApiResponse<void>>("/api/auth/recover", payload);
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/api/auth/me");
  return data;
}

export async function refreshToken(
  payload: TokenRefreshRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/refresh",
    payload,
  );
  return data;
}

export async function logout(
  payload?: LogoutRequest,
): Promise<void> {
  await api.post("/api/auth/logout", payload ?? {});
}

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<void> {
  await api.post("/api/auth/forgot-password", payload);
}

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<void> {
  await api.post("/api/auth/reset-password", payload);
}
