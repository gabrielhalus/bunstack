import { Link } from "@tanstack/react-router";
import { Box, Home, ShieldUser, UsersRound } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { NavSettings } from "./nav-settings";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { useAuth } from "@bunstack/react/hooks/use-auth";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@bunstack/react/components/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { can } = useAuth();
  const { t } = useTranslation("dashboard");

  const data = useMemo(() => ({
    navMain: [
      {
        title: t("pages.home.title"),
        icon: Home,
        href: { to: "/" } as const,
      },
    ],
    navSettings: [
      ...(can("user:list")
        ? [{
            title: t("pages.users.title"),
            icon: UsersRound,
            href: { to: "/users" } as const,
          }]
        : []),
      ...(can("role:list")
        ? [{
            title: t("pages.roles.title"),
            icon: ShieldUser,
            href: { to: "/roles" } as const,
          }]
        : []),
    ],
  }), [t, can]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Box className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t("common:core.name")}</span>
                  <span className="truncate text-xs">{t("common:core.caption")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSettings items={data.navSettings} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
