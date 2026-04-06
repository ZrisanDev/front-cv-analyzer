import { LoginForm } from "@/modules/auth/components/LoginForm"
import { AuthLayout } from "@/modules/auth/components/AuthLayout"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="flex min-h-full items-center justify-center">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}
