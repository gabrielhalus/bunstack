import type { RoleWithMembers } from "@bunstack/shared/db/types/roles";

import { Link } from "@tanstack/react-router";
import React from "react";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";

export function Nav({ role }: { role: RoleWithMembers }) {
  const { t } = useTranslation("roles");

  const nav = (role: RoleWithMembers) => [
    {
      href: `/roles/${role.name}`,
      label: t("nav.display"),
    },
    {
      href: `/roles/${role.name}/members`,
      label: t("nav.members", { count: role.members.length }),
    },
    {
      href: `/roles/${role.name}/permissions`,
      label: "Permissions",
    },
  ];

  return (
    <nav className="flex h-4 items-center space-x-4 text-sm text-muted-foreground">
      {nav(role).map((link, index) => (
        <React.Fragment key={link.href}>
          <Link to={link.href} key={link.href} activeOptions={{ exact: true }} activeProps={() => ({ className: "text-primary underline" })}>
            {link.label}
          </Link>
          {index !== nav(role).length - 1 && <Separator orientation="vertical" />}
        </React.Fragment>
      ))}
    </nav>
  );
}
