import { useQuery } from "@tanstack/react-query";
import { Trans, useTranslation } from "react-i18next";

import { Route as Layout } from "../../route";
import { getAllRolesQueryOptions } from "@/lib/queries/roles";
import { Button } from "@bunstack/ui/components/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@bunstack/ui/components/dialog";
import { Input } from "@bunstack/ui/components/input";
import { Label } from "@bunstack/ui/components/label";

export function AddMembersDialog() {
  const { t } = useTranslation(["common", "web"]);

  const { role } = Layout.useLoaderData();

  const { data, isPending, isError } = useQuery(getAllRolesQueryOptions);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="secondary">{t("web:pages.roles.detail.pages.members.addMembers.label")}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("web:pages.roles.detail.pages.members.addMembers.label")}</DialogTitle>
            <DialogDescription>
              <Trans i18nKey="pages.roles.detail.pages.members.addMembers.description" ns="web" values={{ role: role.label }} components={{ b: <b /> }} />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("actions.cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("actions.cancel")}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
