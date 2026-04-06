"use client"

import { AppSidebar } from "@/components/Layout/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useCreditsBalance } from "@/modules/payment/hooks/useCredits"
import { Skeleton } from "@/components/ui/skeleton"

function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: credits, isLoading } = useCreditsBalance()

  const creditsToDisplay = isLoading
    ? null
    : credits
      ? credits.free_analyses_remaining + credits.paid_analyses_credits
      : 0

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar credits={creditsToDisplay} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-card px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto max-w-3xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
