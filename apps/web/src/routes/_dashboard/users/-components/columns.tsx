import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@bunstack/ui/components/avatar";
import { Checkbox } from "@bunstack/ui/components/checkbox";
import { SortableHeader } from "@bunstack/ui/components/sortable-header";

import type { UserWithRoles } from "@bunstack/shared/database/types/users";

import { ActionDropdown } from "./action-dropdown";

export const columns: ColumnDef<UserWithRoles>[] = [
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
        <div className="text-foreground">{row.getValue("name")}</div>
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
