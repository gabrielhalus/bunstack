import { Link } from "@tanstack/react-router";
import { Box, Home, ShieldUser, UsersRound } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

import { NavSettings } from "./nav-settings";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { can } = useAuth();
  const { t } = useTranslation("app");

  const data = useMemo(() => ({
    navMain: [
      {
        title: "Home",
        icon: Home,
        href: { to: "/" } as const,
      },
    ],
    navSettings: [
      ...(can("user:list")
        ? [{
            title: "Users",
            icon: UsersRound,
            href: { to: "/users" } as const,
          }]
        : []),
      ...(can("role:list")
        ? [{
            title: "Roles",
            icon: ShieldUser,
            href: { to: "/roles" } as const,
          }]
        : []),
    ],
  }), [can]);

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
                  <span className="truncate font-medium">{t("name")}</span>
                  <span className="truncate text-xs">{t("description")}</span>
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
