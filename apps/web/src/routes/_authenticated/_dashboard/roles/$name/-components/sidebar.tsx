import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllRolesQueryOptions } from "@/lib/queries/roles";

export function Sidebar() {
  const { isPending, isError, data } = useQuery(getAllRolesQueryOptions);

  if (isPending) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <aside className="h-full w-75 p-2 border-r-1">
      <div className="flex justify-between">
        <Button variant="link" asChild>
          <Link to="/roles">
            <ArrowLeft />
            Retour
          </Link>
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="link">
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Create New Role
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex p-2 flex-col space-y-1">
        {data.map(role => (
          <Button asChild key={role.id} variant="ghost" className="justify-start">
            <Link to="/roles/$name" params={{ name: role.name }} activeProps={() => ({ className: "bg-muted" })}>
              {role.label}
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  );
}
