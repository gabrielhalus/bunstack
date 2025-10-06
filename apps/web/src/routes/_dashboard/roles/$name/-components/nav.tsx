import type { RoleWithMembers } from "@bunstack/shared/database/types/roles";
import type { LinkOptions } from "@tanstack/react-router";

import { Link, useLoaderData } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@bunstack/ui/components/button";

export function Nav() {
  const { t } = useTranslation("web");

  const { role } = useLoaderData({ from: "/_dashboard/roles/$name" });

  const nav = (role: RoleWithMembers) => [
    {
      label: t("pages.roles.detail.nav.display"),
      linkOptions: {
        to: "/roles/$name",
        params: { name: role.name },
      } as LinkOptions,
    },
    {
      label: t("pages.roles.detail.nav.members", { count: role.members.length }),
      linkOptions: {
        to: "/roles/$name/members",
        params: { name: role.name },
      } as LinkOptions,
    },
    {
      label: t("pages.roles.detail.nav.permissions"),
      linkOptions: {
        to: "/roles/$name/permissions",
        params: { name: role.name },
      } as LinkOptions,
    },
  ];

  return (
    <nav className="py-8 flex h-4 items-center space-x-2 text-sm">
      {nav(role).map(link => (
        <Button
          key={`${link.label}-${link.linkOptions.to}`}
          asChild
          variant="ghost"
          size="sm"
        >
          <Link
            {...link.linkOptions}
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-accent" }}
          >
            {link.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
