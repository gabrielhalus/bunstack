import type { User } from "@bunstack/shared/schemas/users";
import type { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/ui/sortable-header";

export const columns: ColumnDef<User>[] = [
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
    size: 32,
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
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
    size: 250,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const timestamp = row.getValue<number>("createdAt");
      const dateString = timestamp
        ? new Date(timestamp).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      return <div className="text-muted-foreground">{dateString}</div>;
    },
  },
];
