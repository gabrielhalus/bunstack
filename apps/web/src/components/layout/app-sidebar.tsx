import { can } from "@bunstack/shared/access";
import { Link } from "@tanstack/react-router";
import { Box, Home, ShieldUser, Users } from "lucide-react";
import React, { useMemo } from "react";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const data = useMemo(() => ({
    navMain: [
      {
        title: "Home",
        icon: Home,
        href: { to: "/" } as const,
      },
      ...(can(user, "users", "view")
        ? [{
            title: "Users",
            icon: Users,
            href: { to: "/users" } as const,
          }]
        : []),
      ...(can(user, "roles", "view")
        ? [{
            title: "Roles",
            icon: ShieldUser,
            href: { to: "/roles" } as const,
          }]
        : []),
    ],
    navSecondary: [],
  }), [user]);

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
                  <span className="truncate font-medium">Bunstack.</span>
                  <span className="truncate text-xs">BHVR Starter Kit</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
