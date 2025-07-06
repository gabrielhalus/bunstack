import { ChevronRight, type LucideIcon } from "lucide-react";

import { Link, LinkOptions, useLocation } from "@tanstack/react-router";

import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";

export function NavMain({ items }: { items: { title: string; icon: LucideIcon; href: LinkOptions; items?: { title: string; href: LinkOptions }[] }[] }) {
  const location = useLocation();
  const isActive = (href: LinkOptions["to"]) => location.pathname === href;

  return (
    <SidebarMenu>
      {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={isActive(item.href.to)}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.href.to)}>
                <Link {...item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                          <Link {...subItem.href}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
    </SidebarMenu>
  );
}
