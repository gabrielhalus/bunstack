import type { UserWithRoles } from "@bunstack/shared/database/types/users";
import type { ColumnDef } from "@tanstack/react-table";

import { Link } from "@tanstack/react-router";

import { ActionDropdown } from "./action-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@bunstack/ui/components/avatar";
import { SortableHeader } from "@bunstack/ui/components/sortable-header";

export const columns: ColumnDef<UserWithRoles>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={row.original.avatar as string} className="object-cover" />
          <AvatarFallback className="rounded-lg">
            {row
              .getValue<string>("name")
              .split(" ")
              .map(n => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <Link to="/users/$userId" params={{ userId: row.original.id }} className="text-foreground hover:underline">{row.getValue("name")}</Link>
      </div>
    ),
    size: 250,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.email}</div>,
    size: 250,
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="text-muted-foreground overflow-hidden text-ellipsis">
        { row.original.roles.map(r => r.label).join(", ") }
      </div>
    ),
    size: 200,
  },
  {
    id: "spacer",
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "verifiedAt",
    header: ({ column }) => <SortableHeader column={column} title="Verified At" />,
    cell: ({ row }) => {
      const timestamp = row.original.verifiedAt;
      const dateString = timestamp
        ? new Date(timestamp).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      return <div className="text-muted-foreground">{dateString}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const timestamp = row.original.createdAt;
      const dateString = timestamp
        ? new Date(timestamp).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      return <div className="text-muted-foreground">{dateString}</div>;
    },
    size: 150,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionDropdown row={row} />,
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
];
