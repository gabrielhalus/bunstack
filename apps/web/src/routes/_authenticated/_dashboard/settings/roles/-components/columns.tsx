import type { Role } from "@bunstack/shared/schemas/roles";
import type { ColumnDef } from "@tanstack/react-table";

import { Donut } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/ui/sortable-header";

export const columns: ColumnDef<Role>[] = [
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
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    accessorKey: "name",
  },
  {
    id: "actions",
    cell: () => (
      <div className="flex justify-center">
        <Donut />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
];
