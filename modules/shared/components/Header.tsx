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
  const { user, logout, isAuthenticated } = useAuth()
  const { data: credits } = useCreditsBalance()

  const displayName = user?.name || "User"
  const initials = getUserInitials(displayName)

  return (
    <header
      className={`flex h-14 shrink-0 items-center justify-end border-b bg-card px-4 md:justify-between ${className ?? ""}`}
    >
      {/* Spacer for mobile hamburger */}
      <div className="w-8 md:hidden" />

      {/* Desktop title + credit badge area */}
      <div className="hidden md:flex md:items-center md:gap-3">
        {isAuthenticated && credits && (
          <CreditBadge
            freeRemaining={credits.free_analyses_remaining}
            paidCredits={credits.paid_analyses_credits}
          />
        )}
      </div>

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
            <span className="truncate">{user?.email ?? "User"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
