"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { useCreditsBalance } from "@/modules/payment/hooks/useCredits"
import { CreditBadge } from "@/modules/payment/components/CreditBadge"

interface HeaderProps {
  className?: string
}

function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function Header({ className }: HeaderProps) {
  const { user, logout, isAuthenticated, token, isInitializing } = useAuth()
  const { data: credits } = useCreditsBalance()

  const displayName = user?.name || "User"
  const initials = getUserInitials(displayName)

  // Debug log
  console.log('[Header] Debug:', {
    isAuthenticated,
    token: !!token,
    tokenValue: token?.substring(0, 20),
    user,
    credits,
    isInitializing,
    'user exists': !!user,
    'user.name': user?.name,
    'user.email': user?.email,
  })

  return (
    <header
      className={`flex h-14 shrink-0 items-center justify-end border-b bg-card px-4 md:justify-between ${className ?? ""}`}
    >
      {/* Credit badge - show only after auth is initialized */}
      {!isInitializing && (isAuthenticated || !!token) && (
        <div className="flex items-center mr-2 md:mr-0">
          {credits ? (
            <CreditBadge
              freeRemaining={credits.free_analyses_remaining}
              paidCredits={credits.paid_analyses_credits}
            />
          ) : (
            <Skeleton className="h-6 w-24 rounded-full" />
          )}
        </div>
      )}

      {/* User dropdown - show if user exists, show skeleton only during initialization */}
      {!isInitializing && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled>
              <User className="size-4" />
              <span className="truncate">{user.email ?? "User"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : isInitializing ? (
        <Skeleton className="h-9 w-32" />
      ) : null}
    </header>
  )
}
