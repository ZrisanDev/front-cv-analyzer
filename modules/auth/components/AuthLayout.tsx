import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8",
        className
      )}
      suppressHydrationWarning
    >
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
