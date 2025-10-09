import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Route as Layout } from "../../route";
import { AvatarUser } from "@/components/avatar-user";
import { getAllUsersQueryOptions } from "@/queries/users";
import { Button } from "@bunstack/ui/components/button";
import { Checkbox } from "@bunstack/ui/components/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@bunstack/ui/components/dialog";
import { Label } from "@bunstack/ui/components/label";
import { ScrollArea } from "@bunstack/ui/components/scroll-area";

export function AddMembersDialog() {
  const { t } = useTranslation(["common", "web"]);

  const { role: { label, members } } = Layout.useLoaderData();
  const { data: { users } } = useSuspenseQuery(getAllUsersQueryOptions);

  const memberIds = members.map(({ id }) => id);
  const filteredUsers = users.filter(({ id }) => !memberIds.includes(id));

  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(() => new Set());

  function toggleUser(userId: string) {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);

      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }

      return next;
    });
  }

  const _handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>{t("web:pages.roles.detail.pages.members.addMembers.label")}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("web:pages.roles.detail.pages.members.addMembers.label")}</DialogTitle>
            <DialogDescription>
              <Trans i18nKey="pages.roles.detail.pages.members.addMembers.description" ns="web" values={{ role: label }} components={{ b: <b /> }} />
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <Button key={user.id} variant="ghost" className="flex justify-start w-full" onClick={() => toggleUser(user.id)}>
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUserIds.has(user.id)}
                      onCheckedChange={() => toggleUser(user.id)}
                    />
                    <AvatarUser size="sm" {...user} />
                    <Label htmlFor={`user-${user.id}`} className="font-normal cursor-pointer">{user.name}</Label>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="flex gap-4">
            <DialogClose asChild>
              <Button className="flex-1" variant="outline">{t("actions.cancel")}</Button>
            </DialogClose>
            <Button className="flex-1" type="submit">{t("actions.add")}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
