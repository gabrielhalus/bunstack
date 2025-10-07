import type { User } from "@bunstack/shared/database/types/users";

import { Link } from "@tanstack/react-router";
import { XIcon } from "lucide-react";

import { Route as Layout } from "../../route";
import { Avatar, AvatarFallback, AvatarImage } from "@bunstack/ui/components/avatar";
import { Button } from "@bunstack/ui/components/button";
import sayno from "@bunstack/ui/lib/sayno";

export function MembersList() {
  const { role: { members, ...role } } = Layout.useLoaderData();

  async function handleRemove(user: User, event: React.MouseEvent) {
    if (!event.shiftKey) {
      const confirmation = await sayno({ title: "Retirer le membre", description: `Supprimer le rôle ${role.label} de ${user.name} ?` });

      if (!confirmation) {
        return;
      }
    }

    console.log("Removing user:", user.name);
  }

  return (
    <div>
      {members.map(user => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar as string} className="object-cover" />
              <AvatarFallback className="rounded-lg">
                {user.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Link to="/users/$userId" params={{ userId: user.id }} className="text-sm text-foreground hover:underline">{user.name}</Link>
          </div>
          <Button variant="ghost" size="icon" onClick={event => handleRemove(user, event)}>
            <XIcon className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
