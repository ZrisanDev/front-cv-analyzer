import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { TOKEN_KEY, ROUTES } from "@/modules/shared/lib/constants"
import MainLayoutClient from "./main-layout-client"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_KEY)?.value

  if (!token) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (baseUrl) {
      const url = new URL(ROUTES.LOGIN, baseUrl)
      url.searchParams.set("from", "/main")
      redirect(url.toString())
    } else {
      redirect(`${ROUTES.LOGIN}?from=/main`)
    }
  }

  return <MainLayoutClient>{children}</MainLayoutClient>
}
