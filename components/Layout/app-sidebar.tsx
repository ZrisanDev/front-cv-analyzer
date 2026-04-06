"use client";

import * as React from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";

import { NavMain } from "@/components/Layout/nav-main";
import { NavUser } from "@/components/Layout/nav-user";
import { TeamSwitcher } from "@/components/Layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  FileSearch,
  BarChart3,
  History,
} from "lucide-react";
import { ROUTES } from "@/modules/shared/lib/constants";

const navMain = [
  {
    title: "Análisis",
    url: ROUTES.ANALYZE,
    icon: <FileSearch />,
    isActive: true,
  },
  {
    title: "Historial",
    url: ROUTES.HISTORY,
    icon: <History />,
  },
  {
    title: "Stats",
    url: ROUTES.DASHBOARD,
    icon: <BarChart3 />,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  credits?: number | null
}

export function AppSidebar({ credits, ...props }: AppSidebarProps) {
  const planLabel = React.useMemo(() => {
    if (credits === null) return "Cargando..."
    if (credits === 0) return "0 créditos"
    return `${credits} crédito${credits === 1 ? '' : 's'}`
  }, [credits])

  const teams = React.useMemo(() => [
    {
      name: "CV Analyzer",
      logo: <FileSearch />,
      plan: planLabel,
    },
  ], [planLabel])

  console.log('[AppSidebar] Rendering with credits:', credits, 'planLabel:', planLabel)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUserWrapper />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// Wrapper component to use hooks (cannot be inside the exported function)
function NavUserWrapper() {
  const { user } = useAuth();

  return (
    <NavUser
      user={{
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        avatar: "/avatars/shadcn.jpg",
      }}
    />
  );
}
