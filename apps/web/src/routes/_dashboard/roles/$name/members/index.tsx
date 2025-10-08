import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// import { AddMembersDialog } from "./-components/add-members-dialog";
import { RoleMembersList } from "./-components/members-list";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@bunstack/ui/components/input-group";

export const Route = createFileRoute(
  "/_dashboard/roles/$name/members/",
)({
  loader: () => ({ crumb: "pages.roles.detail.pages.members.title" }),
  component: RoleMembers,
});

function RoleMembers() {
  const { t } = useTranslation("web");

  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput placeholder={t("pages.roles.detail.pages.members.searchMembers")} value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} />
        </InputGroup>
        {/* <AddMembersDialog /> */}
      </div>
      <RoleMembersList search={globalFilter} />
    </div>
  );
}
