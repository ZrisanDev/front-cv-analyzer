import { RegisterForm } from "@/modules/auth/components/RegisterForm"
import { AuthLayout } from "@/modules/auth/components/AuthLayout"

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
