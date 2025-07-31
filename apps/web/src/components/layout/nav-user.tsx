import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LogoutButton } from "@/components/layout/logout-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { generateAvatarFallback } from "@/helpers/generate-avatar-fallback";
import { useAuth } from "@/hooks/use-auth";

import { Skeleton } from "../ui/skeleton";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, loading, isAuthenticated } = useAuth({ redirect: "/login" });
  const { t, i18n } = useTranslation("common");

  const locales = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const currentLocale = locales.find(locale => locale.code === i18n.language) || locales[0];

  const handleLocaleChange = (localeCode: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    i18n.changeLanguage(localeCode);
  };

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="flex w-full items-center gap-2 p-2 ">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="grid flex-1 gap-1">
            <Skeleton className="h-3.75 w-24" />
            <Skeleton className="h-3.75 w-32" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const avatarFallback = !user.avatar ? generateAvatarFallback(user.name) : undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg overflow-visible">
                {user.avatar && (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover h-8 w-8 rounded-lg"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar && (
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover h-8 w-8 rounded-lg"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Locale submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("generic.language")}
                  {" "}
                  {currentLocale.name}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {locales.map(locale => (
                  <DropdownMenuItem
                    key={locale.code}
                    onClick={event => handleLocaleChange(locale.code, event)}
                    className={`flex items-center gap-2 ${
                      i18n.language === locale.code ? "bg-accent" : ""
                    }`}
                  >
                    <span className="text-sm">{locale.flag}</span>
                    <span className="text-sm">{locale.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <LogoutButton variant="dropdown" />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
