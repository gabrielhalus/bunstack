import type { RoleWithMembersCount } from "@bunstack/shared/db/types/roles";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@bunstack/ui/components/button";
import { Checkbox } from "@bunstack/ui/components/checkbox";
import { SortableHeader } from "@bunstack/ui/components/sortable-header";
import { Tooltip, TooltipContent, TooltipTrigger } from "@bunstack/ui/components/tooltip";
import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

import { ActionDropdown } from "./action-dropdown";

export const columns: ColumnDef<RoleWithMembersCount>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "label",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <Link to="/roles/$name" params={{ name: row.original.name }} className="text-foreground hover:underline">
        {row.original.label}
      </Link>
    ),
    size: 250,
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 250,
  },
  {
    accessorKey: "members",
    header: ({ column }) => <SortableHeader column={column} title="Members" />,
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="sm">
            <Link to="/roles/$name/members" params={{ name: row.original.name }} className="flex items-center gap-2">
              {row.original.members}
              <UserRound className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          Show members
        </TooltipContent>
      </Tooltip>
    ),
    size: 0,
  },
  {
    id: "spacer",
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionDropdown row={row} />,
    enableSorting: false,
    enableHiding: false,
    size: 0,
  },
];
