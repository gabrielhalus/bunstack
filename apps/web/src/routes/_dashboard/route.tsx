import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Separator } from "@bunstack/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@bunstack/ui/components/sidebar";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
  loader: () => {
    return {
      crumb: "pages.home.title",
    };
  },
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b-1">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumbs />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
