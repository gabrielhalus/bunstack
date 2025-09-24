import type { RoleWithMembers } from "@bunstack/shared/db/types/roles";
import type { LinkOptions } from "@tanstack/react-router";

import { Button } from "@bunstack/ui/components/button";
import { Link, useLoaderData } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Nav() {
  const { t } = useTranslation("roles");

  const { role } = useLoaderData({ from: "/_dashboard/roles/$name" });

  const nav = (role: RoleWithMembers) => [
    {
      label: t("detail.nav.display"),
      linkOptions: {
        to: "/roles/$name",
        params: { name: role.name },
      } as LinkOptions,
    },
    {
      label: t("detail.nav.members", { count: role.members.length }),
      linkOptions: {
        to: "/roles/$name/members",
        params: { name: role.name },
      } as LinkOptions,
    },
    {
      label: t("detail.nav.permissions"),
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
