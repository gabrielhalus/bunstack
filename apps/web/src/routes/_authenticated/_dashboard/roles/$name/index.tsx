import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Form } from "./-components/form";

export const Route = createFileRoute("/_authenticated/_dashboard/roles/$name/")({
  component: RoleDetails,
});

function RoleDetails() {
  const { t } = useTranslation("roles");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{t("detail.title")}</h1>
        <p className="text-muted-foreground">{t("detail.subtitle")}</p>
      </div>
      <Form />
    </div>
  );
}
