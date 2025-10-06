import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Form } from "./-components/form";

export const Route = createFileRoute("/_dashboard/roles/$name/")({
  component: RoleDetails,
});

function RoleDetails() {
  const { t } = useTranslation("web");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{t("pages.roles.detail.title")}</h1>
        <p className="text-muted-foreground">{t("pages.roles.detail.subtitle")}</p>
      </div>
      <Form />
    </div>
  );
}
