"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileSearch, History, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/modules/shared/lib/constants"
import { useState } from "react"

const NAV_ITEMS = [
  { href: ROUTES.ANALYZE, label: "Analyze", icon: FileSearch },
  { href: ROUTES.HISTORY, label: "History", icon: History },
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: BarChart3 },
] as const

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== ROUTES.ANALYZE && pathname.startsWith(href))

        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile: hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card p-4 transition-transform duration-200 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col pt-12">
          <Link href={ROUTES.ANALYZE} className="mb-8 px-3">
            <h1 className="text-lg font-bold">CV Analyzer</h1>
          </Link>
          {navContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-full w-64 shrink-0 border-r bg-card p-4 md:block",
          className
        )}
      >
        <div className="flex h-full flex-col">
          <Link href={ROUTES.ANALYZE} className="mb-8 px-3">
            <h1 className="text-lg font-bold">CV Analyzer</h1>
          </Link>
          {navContent}
        </div>
      </aside>
    </>
  )
}
