import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { TOKEN_KEY, ROUTES } from "@/modules/shared/lib/constants"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_KEY)?.value

  if (token) {
    redirect(ROUTES.ANALYZE)
  }

  return <>{children}</>
}
