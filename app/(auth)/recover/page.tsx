import { RecoverPasswordForm } from "@/modules/auth/components/RecoverPasswordForm"
import { AuthLayout } from "@/modules/auth/components/AuthLayout"

export default function RecoverPage() {
  return (
    <AuthLayout>
      <RecoverPasswordForm />
    </AuthLayout>
  )
}
