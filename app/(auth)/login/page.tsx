import { LoginForm } from "@/modules/auth/components/LoginForm"
import { AuthLayout } from "@/modules/auth/components/AuthLayout"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}
